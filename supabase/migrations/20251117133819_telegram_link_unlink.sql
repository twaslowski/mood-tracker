ALTER TABLE verification_codes
    ADD COLUMN telegram_username TEXT;

DROP POLICY IF EXISTS "Users can view own telegram account"
    ON telegram_accounts;
CREATE POLICY own_telegram_account
    ON telegram_accounts FOR ALL
    USING ((select auth.uid()) = user_id);

