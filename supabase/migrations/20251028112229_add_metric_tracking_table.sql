CREATE TABLE IF NOT EXISTS metric_tracking
(
    user_id    VARCHAR(255)                NOT NULL,
    metric_id  UUID REFERENCES metric (id) NOT NULL,
    baseline   NUMERIC                     NOT NULL,
    tracked_at TIMESTAMP WITH TIME ZONE    NOT NULL,
    PRIMARY KEY (user_id, metric_id, tracked_at)
);
