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

-- Create magic_tokens table
CREATE TABLE magic_tokens
(
    token       TEXT PRIMARY KEY,
    telegram_id BIGINT                   NOT NULL,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    used        BOOLEAN                  DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_telegram_accounts_user_id ON telegram_accounts (user_id);
CREATE INDEX idx_verification_codes_telegram_id ON verification_codes (telegram_id);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes (expires_at);
CREATE INDEX idx_magic_tokens_telegram_id ON magic_tokens (telegram_id);
CREATE INDEX idx_magic_tokens_expires_at ON magic_tokens (expires_at);

-- Row Level Security (RLS) Policies
ALTER TABLE telegram_accounts
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_tokens
    ENABLE ROW LEVEL SECURITY;

-- Users can read their own telegram account info
CREATE POLICY "Users can view own telegram account"
    ON telegram_accounts FOR SELECT
    USING ((select auth.uid()) = user_id);

-- Service role has full access (for edge functions)
CREATE POLICY "Service role has full access to telegram_accounts"
    ON telegram_accounts FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to verification_codes"
    ON verification_codes FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role has full access to magic_tokens"
    ON magic_tokens FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to clean up expired tokens (run daily via pg_cron)
-- todo:
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
    RETURNS void AS
$$
BEGIN
    DELETE
    FROM verification_codes
    WHERE expires_at < NOW() - INTERVAL '1 day';

    DELETE
    FROM magic_tokens
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting table (optional but recommended)
CREATE TABLE telegram_rate_limits
(
    telegram_id   BIGINT PRIMARY KEY,
    request_count INTEGER                  DEFAULT 1,
    window_start  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE telegram_rate_limits
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to telegram_rate_limits"
    ON telegram_rate_limits FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');