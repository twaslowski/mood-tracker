CREATE TABLE IF NOT EXISTS tracking_default
(
    metric_id UUID REFERENCES metric (id) NOT NULL PRIMARY KEY,
    baseline  NUMERIC                     NOT NULL
);

INSERT INTO tracking_default (metric_id, baseline)
SELECT id, 0
FROM metric
WHERE name = 'Mood';

INSERT INTO tracking_default (metric_id, baseline)
SELECT id, 8
FROM metric
WHERE name = 'Sleep';