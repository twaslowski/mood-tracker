DROP POLICY IF EXISTS insert_own_metrics ON metric;
CREATE POLICY insert_own_metrics ON metric
    FOR ALL
    TO authenticated
    USING ((select auth.uid())::varchar IS NOT NULL AND auth.uid()::varchar = owner_id)
    WITH CHECK ((select auth.uid()::varchar) = owner_id);

DROP POLICY IF EXISTS own_entries ON entry;
CREATE POLICY own_entries ON entry
    FOR ALL
    TO authenticated
    USING ((select auth.uid())::varchar IS NOT NULL AND (select auth.uid())::varchar = user_id)
    WITH CHECK ((select auth.uid())::varchar IS NOT NULL AND (select auth.uid())::varchar = user_id);

DROP POLICY IF EXISTS own_entry_values ON entry_value;
CREATE POLICY own_entry_values ON entry_value
    FOR ALL
    TO authenticated
    USING ((select auth.uid()) IS NOT NULL AND entry_id IN (SELECT id
                                                   FROM entry
                                                   WHERE user_id = (select auth.uid())::varchar))
    WITH CHECK ((select auth.uid()) IS NOT NULL AND entry_id IN (SELECT id
                                                        FROM entry
                                                        WHERE user_id = (select auth.uid())::varchar));

DROP POLICY IF EXISTS own_metric_tracking ON metric_tracking;
CREATE POLICY own_metric_tracking ON metric_tracking
    FOR ALL
    TO authenticated
    USING ((select auth.uid())::varchar IS NOT NULL AND (select auth.uid())::varchar = user_id)
    WITH CHECK ((select auth.uid())::varchar IS NOT NULL AND (select auth.uid())::varchar = user_id);
