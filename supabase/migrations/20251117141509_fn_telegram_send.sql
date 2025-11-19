select vault.create_secret('https://iwegsqflyrbynymrvfqa.supabase.co', 'project_url');
-- The service role key is required, but cannot be checked into version control. Insert it manually:
-- psql -U postgres -h localhost -p 54322 -c "select vault.create_secret('$SERVICE_ROLE_KEY', 'service_role_key');"

-- Function to send a Telegram message via edge function
CREATE OR REPLACE FUNCTION notify_user(p_user_id UUID, p_message TEXT) RETURNS BIGINT AS
$$
DECLARE
    v_telegram_id BIGINT;
    v_request_id BIGINT;
BEGIN
    -- Get telegram_id for the user
    SELECT telegram_id
    INTO v_telegram_id
    FROM telegram_accounts
    WHERE user_id = p_user_id;

    -- Return early if user has no linked telegram account
    IF v_telegram_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT net.http_post(
                   url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') ||
                          '/functions/v1/telegram-message',
                   headers := jsonb_build_object(
                           'Content-Type', 'application/json',
                           'Authorization',
                           'Bearer ' ||
                           (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
                              ),
                   body := jsonb_build_object(
                           'chatId', v_telegram_id::TEXT,
                           'message', p_message
                           )
           )
               INTO v_request_id;

    RETURN v_request_id;

    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to send Telegram message to user %: %', p_user_id, SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
