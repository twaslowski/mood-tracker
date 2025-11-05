-- Drop existing foreign key constraints that don't have CASCADE
-- and recreate them with ON DELETE CASCADE

-- entry_value table: cascade deletes from both entry and metric
ALTER TABLE entry_value
    DROP CONSTRAINT IF EXISTS entry_value_entry_id_fkey,
    ADD CONSTRAINT entry_value_entry_id_fkey
        FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE;

ALTER TABLE entry_value
    DROP CONSTRAINT IF EXISTS entry_value_metric_id_fkey,
    ADD CONSTRAINT entry_value_metric_id_fkey
        FOREIGN KEY (metric_id) REFERENCES metric (id) ON DELETE CASCADE;

-- metric_tracking table: cascade deletes from metric
ALTER TABLE metric_tracking
    DROP CONSTRAINT IF EXISTS metric_tracking_metric_id_fkey,
    ADD CONSTRAINT metric_tracking_metric_id_fkey
        FOREIGN KEY (metric_id) REFERENCES metric (id) ON DELETE CASCADE;

-- tracking_default table: cascade deletes from metric
ALTER TABLE tracking_default
    DROP CONSTRAINT IF EXISTS tracking_default_metric_id_fkey,
    ADD CONSTRAINT tracking_default_metric_id_fkey
        FOREIGN KEY (metric_id) REFERENCES metric (id) ON DELETE CASCADE;

