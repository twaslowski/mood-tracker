create table if not exists metric
(
    id                 UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    name               VARCHAR(255)                              NOT NULL,
    description        TEXT                                      NOT NULL,
    labels             JSONB,
    owner_id           VARCHAR(36)              DEFAULT 'SYSTEM' NOT NULL,
    creation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()    NOT NULL,
    update_timestamp   TIMESTAMP WITH TIME ZONE DEFAULT now()    NOT NULL,
    metric_type        VARCHAR(50)                               NOT NULL,
    min_value          NUMERIC,
    max_value          NUMERIC,
    constraint uq_metric_name_user_id
        unique (name, owner_id)
);

create table if not exists entry
(
    id                 SERIAL PRIMARY KEY,
    user_id            VARCHAR(255),
    recorded_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    creation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_timestamp  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

create table if not exists entry_value
(
    entry_id  BIGINT REFERENCES entry (id),
    metric_id UUID REFERENCES metric (id),
    value     NUMERIC NOT NULL,
    PRIMARY KEY (entry_id, metric_id)
);
