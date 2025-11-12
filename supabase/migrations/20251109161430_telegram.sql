-- Create telegram_accounts table
CREATE TABLE telegram_accounts
(
    telegram_id       BIGINT PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    telegram_username TEXT,
    linked_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at     TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id)
);

-- Create verification_codes table
CREATE TABLE verification_codes
(
    id          UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    telegram_id BIGINT                   NOT NULL,
    code        TEXT                     NOT NULL,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    used        BOOLEAN                  DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_telegram_accounts_user_id ON telegram_accounts (user_id);
CREATE INDEX idx_verification_codes_telegram_id ON verification_codes (telegram_id);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes (expires_at);

-- Row Level Security (RLS) Policies
ALTER TABLE telegram_accounts
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes
    ENABLE ROW LEVEL SECURITY;

-- Users can read their own telegram account info
CREATE POLICY "Users can view own telegram account"
    ON telegram_accounts FOR SELECT
    USING ((select auth.uid()) = user_id);
