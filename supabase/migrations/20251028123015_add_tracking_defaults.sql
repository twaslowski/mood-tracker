CREATE TABLE IF NOT EXISTS tracking_default
(
    metric_id UUID REFERENCES metric (id) NOT NULL PRIMARY KEY,
    baseline  NUMERIC                     NOT NULL
);