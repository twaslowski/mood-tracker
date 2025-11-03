-- Enable RLS
ALTER TABLE metric
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_value
    ENABLE ROW LEVEL SECURITY;

-- METRIC TABLE POLICIES
-- 1. Allow anyone to select metrics with owner_id = 'SYSTEM'
CREATE POLICY select_system_metrics ON metric
    FOR SELECT
    USING (owner_id = 'SYSTEM');

-- 3. Allow authenticated users to insert metrics with their own user id
CREATE POLICY insert_own_metrics ON metric
    FOR ALL
    TO authenticated
    USING (auth.uid()::varchar IS NOT NULL AND auth.uid()::varchar = owner_id)
    WITH CHECK ((select auth.uid()::varchar) = owner_id);

-- Create index on owner_id for performance as recommended
-- https://supabase.com/docs/guides/database/postgres/row-level-security#add-indexes
CREATE INDEX idx_metric_owner_id ON metric (owner_id);

-- ENTRY TABLE POLICIES
-- 1. Allow authenticated users to select/insert/update/delete their own entries
CREATE POLICY own_entries ON entry
    FOR ALL
    TO authenticated
    USING (auth.uid()::varchar IS NOT NULL AND auth.uid()::varchar = user_id)
    WITH CHECK (auth.uid()::varchar IS NOT NULL AND auth.uid()::varchar = user_id);

-- ENTRY_VALUE TABLE POLICIES
-- 1. Allow authenticated users to CRUD entry_values only if the entry belongs to them
CREATE POLICY own_entry_values ON entry_value
    FOR ALL
    TO authenticated
    USING (auth.uid() IS NOT NULL AND entry_id IN (SELECT id
                                                 FROM entry
                                                 WHERE user_id = auth.uid()::varchar))
    WITH CHECK (auth.uid() IS NOT NULL AND entry_id IN (SELECT id
                                                      FROM entry
                                                      WHERE user_id = auth.uid()::varchar));

-- METRIC TRACKING TABLE POLICIES
ALTER TABLE metric_tracking
    ENABLE ROW LEVEL SECURITY;

-- 1. Allow authenticated users to CRUD their own metric tracking records
CREATE POLICY own_metric_tracking ON metric_tracking
    FOR ALL
    TO authenticated
    USING (auth.uid()::varchar IS NOT NULL AND auth.uid()::varchar = user_id)
    WITH CHECK (auth.uid()::varchar IS NOT NULL AND auth.uid()::varchar = user_id);

-- Create index on user_id for performance as recommended
CREATE INDEX idx_metric_tracking_user_id ON metric_tracking (user_id);

-- TRACKING DEFAULTS TABLE POLICIES
-- 1. Allow read to everybody
ALTER TABLE tracking_default
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_tracking_defaults ON tracking_default
    FOR SELECT
    TO authenticated, anon
    USING (true);