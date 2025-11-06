ALTER TABLE metric_tracking
DROP CONSTRAINT metric_tracking_pkey;

ALTER TABLE metric_tracking
ADD PRIMARY KEY (user_id, metric_id);
