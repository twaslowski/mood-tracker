CREATE INDEX IF NOT EXISTS idx_entry_value_metric_id
    ON entry_value (metric_id);

CREATE INDEX IF NOT EXISTS idx_metric_tracking_metric_id
    ON metric_tracking (metric_id);