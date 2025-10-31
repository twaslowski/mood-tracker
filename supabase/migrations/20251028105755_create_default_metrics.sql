INSERT INTO metric (name, description, labels, owner_id, metric_type, min_value, max_value)
VALUES ('Mood',
        'Daily mood rating',
        '{"Severely Depressed": -3, "Depressed": -2, "Slightly Depressed": -1, "Neutral": 0, "Slightly Manic": 1, "Manic": 2, "Severely Manic": 3}'::jsonb,
        'SYSTEM',
        'discrete',
        -3, 3);

INSERT INTO metric (name, description, labels, owner_id, metric_type, min_value, max_value)
VALUES ('Sleep',
        'Total hours of sleep per night',
        '{}'::jsonb,
        'SYSTEM',
        'continuous',
        0, 16);