INSERT INTO metric (name, description, labels, owner_id, metric_type, min_value, max_value)
VALUES ('Mood',
        'Daily mood rating',
        '{"-3": "Severely Depressed", "-2": "Depressed", "-1": "Slightly Depressed", "0": "Neutral", "1": "Slightly Manic", "2": "Manic", "3": "Severely Manic"}'::jsonb,
        'SYSTEM',
        'discrete',
        -3, 3);

INSERT INTO metric (name, description, labels, owner_id, metric_type, min_value, max_value)
VALUES ('Sleep',
        'Total hours of sleep per night',
        NULL,
        'SYSTEM',
        'continuous',
        0, 16);