create table metric
(
    id                 BIGINT                                    NOT NULL PRIMARY KEY,
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

create table record
(
    id                 BIGINT                   NOT NULL PRIMARY KEY,
    user_id            VARCHAR(255),
    recorded_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    creation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_timestamp  TIMESTAMP WITH TIME ZONE NOT NULL
);

create table record_value
(
    record_id BIGINT REFERENCES record (id),
    metric_id BIGINT REFERENCES metric (id),
    value     NUMERIC NOT NULL,
    PRIMARY KEY (record_id, metric_id)
);
