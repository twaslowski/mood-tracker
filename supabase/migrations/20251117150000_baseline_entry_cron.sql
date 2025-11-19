-- Table to store user cron job configurations for baseline entries
CREATE TABLE IF NOT EXISTS auto_baseline_schedule
(
    id            UUID PRIMARY KEY                  DEFAULT gen_random_uuid(),
    user_id       UUID             NOT NULL UNIQUE,
    cron_schedule VARCHAR(100)             NOT NULL,
    webhook_url   TEXT,
    enabled       BOOLEAN                  NOT NULL DEFAULT true,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_run_at   TIMESTAMP WITH TIME ZONE,
    cron_job_id   BIGINT
);

-- Enable RLS
ALTER TABLE auto_baseline_schedule
    ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only manage their own schedules
CREATE POLICY own_baseline_schedule ON auto_baseline_schedule
    FOR ALL
    TO authenticated
    USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT auth.uid()) = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_auto_baseline_schedule_user_id
    ON auto_baseline_schedule (user_id);

CREATE INDEX IF NOT EXISTS idx_auto_baseline_schedule_enabled
    ON auto_baseline_schedule (enabled) WHERE enabled = true;

-- Function to create a baseline entry for a user using their metric_tracking baselines
CREATE OR REPLACE FUNCTION create_baseline_entry(p_user_id UUID)
    RETURNS BIGINT AS
$$
DECLARE
    v_entry_id BIGINT;
BEGIN
    -- Create a new entry for the user with current timestamp
    INSERT INTO entry (user_id, recorded_at, creation_timestamp, updated_timestamp)
    VALUES (p_user_id, NOW(), NOW(), NOW())
    RETURNING id INTO v_entry_id;

    -- Insert entry_values for all tracked metrics using their baseline values
    INSERT INTO entry_value (entry_id, metric_id, value)
    SELECT v_entry_id,
           metric_id,
           baseline
    FROM metric_tracking
    WHERE user_id = p_user_id::VARCHAR;

    -- Update last_run_at if there's a schedule
    UPDATE auto_baseline_schedule
    SET last_run_at = NOW()
    WHERE user_id = p_user_id;

    -- Update last_run_at in auto_baseline_schedule for the user
    UPDATE auto_baseline_schedule
    SET last_run_at = NOW()
    WHERE user_id = p_user_id;

    PERFORM notify_user(p_user_id, 'A baseline record was automatically created.');

    -- Return the created entry ID
    RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to automatically schedule cron job when a schedule is inserted or updated
CREATE OR REPLACE FUNCTION sync_baseline_schedule_to_cron()
    RETURNS TRIGGER AS
$$
DECLARE
    v_cron_job_id BIGINT;
BEGIN
    -- If there's an existing cron job, unschedule it first
    IF OLD.cron_job_id IS NOT NULL THEN
        PERFORM cron.unschedule(OLD.cron_job_id);
    END IF;

    -- If the schedule is enabled, create a new cron job
    IF NEW.enabled THEN
        SELECT cron.schedule(
                       'baseline_entry_' || NEW.user_id,
                       NEW.cron_schedule,
                       format('SELECT create_baseline_entry(%L);', NEW.user_id)
               )
        INTO v_cron_job_id;

        -- Store the cron job ID
        NEW.cron_job_id := v_cron_job_id;
    ELSE
        NEW.cron_job_id := NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to automatically unschedule cron job when a schedule is deleted
CREATE OR REPLACE FUNCTION cleanup_baseline_schedule_cron()
    RETURNS TRIGGER AS
$$
BEGIN
    -- Unschedule the cron job if it exists
    IF OLD.cron_job_id IS NOT NULL THEN
        PERFORM cron.unschedule(OLD.cron_job_id);
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT and UPDATE
CREATE TRIGGER sync_baseline_schedule_on_upsert
    BEFORE INSERT OR UPDATE
    ON auto_baseline_schedule
    FOR EACH ROW
EXECUTE FUNCTION sync_baseline_schedule_to_cron();

-- Create trigger for DELETE
CREATE TRIGGER cleanup_baseline_schedule_on_delete
    BEFORE DELETE
    ON auto_baseline_schedule
    FOR EACH ROW
EXECUTE FUNCTION cleanup_baseline_schedule_cron();
