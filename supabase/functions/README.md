# Telegram Authentication Setup Guide

## Prerequisites

1. **Telegram Bot**: Create a bot via [@BotFather](https://t.me/botfather)
2. **Supabase Project**: With database and edge functions enabled

## Step 1: Database Setup

The schema is located at `supabase/migrations/20251109161430_telegram.sql`. Apply it to your database:

```shell
npx supabase migration up  # local
npx supabase db push       # remote
```

## Step 2: Environment Variables

Set these secrets in your Supabase project:

```bash
# In Supabase Dashboard > Project Settings > Edge Functions

TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
APP_URL=https://yourdomain.com
```

Alternatively, populate your .env file and use the Supabase CLI:

```bash
supabase secrets set --env-file .env
```

The following are automatically available:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Deploy Edge Functions

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy telegram-webhook
supabase functions deploy auth-telegram
```

## Step 3.1: Developing Locally

To test functions locally, serve them and use ngrok for webhook tunneling:

```bash
npx supabase functions serve telegram-webhook --no-verify-jwt --env-file supabase/functions/telegram-webhook/.env
ngrok http 54321
```

Set up the webhook locally:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://<ngrok-random-id>.ngrok-free.app/functions/v1/telegram-webhook\"}"
```

## Step 4: Configure Telegram Webhook

Set your webhook URL to point to the edge function:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/telegram-webhook\"}"
```

## Step 5: Frontend Integration

### Linking Flow (New Users)

```javascript
// When user enters verification code
const response = await fetch(
  "https://your-project.supabase.co/functions/v1/auth-telegram?action=verify-code",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id: 123456789,
      code: "123456",
      email: "user@example.com", // Optional
    }),
  },
);

const { session, error } = await response.json();

if (session) {
  // Set session in Supabase client
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  // Redirect to app
}
```

### Magic Link Flow (Returning Users)

```javascript
// On your /auth/telegram page, extract token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

const response = await fetch(
  "https://your-project.supabase.co/functions/v1/auth-telegram?action=verify-token",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  },
);

const { session, error } = await response.json();

if (session) {
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  // Redirect to app
}
```

## User Flow

### First Time Users

1. User sends `/start` to your Telegram bot
2. Bot sends 6-digit verification code (expires in 5 min)
3. User goes to your website and enters code
4. Account is created and linked
5. User is logged in

### Returning Users

1. User sends `/login` (or `/start`) to bot
2. Bot sends magic link (expires in 60 min)
3. User clicks link
4. User is logged in automatically

## Optional Enhancements

### Rate Limiting

Add this function to `telegram-webhook`:

```typescript
async function checkRateLimit(telegramId: number): Promise<boolean> {
  const { data } = await supabase
    .from("telegram_rate_limits")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  if (!data) {
    await supabase.from("telegram_rate_limits").insert({
      telegram_id: telegramId,
      request_count: 1,
      window_start: now.toISOString(),
    });
    return true;
  }

  if (new Date(data.window_start) < hourAgo) {
    // Reset window
    await supabase
      .from("telegram_rate_limits")
      .update({ request_count: 1, window_start: now.toISOString() })
      .eq("telegram_id", telegramId);
    return true;
  }

  if (data.request_count >= 5) {
    return false; // Rate limited
  }

  await supabase
    .from("telegram_rate_limits")
    .update({ request_count: data.request_count + 1 })
    .eq("telegram_id", telegramId);

  return true;
}
```

### Cleanup Job

If you have `pg_cron` enabled:

```sql
SELECT cron.schedule(
  'cleanup-expired-tokens',
  '0 2 * * *', -- Daily at 2 AM
  'SELECT cleanup_expired_tokens()'
);
```

## Testing

1. Send `/start` to your bot
2. You should receive a 6-digit code
3. Enter code on your website
4. Account should be created
5. Send `/login` to bot
6. Click magic link
7. Should be logged in

## Security Notes

- Magic links are single-use only
- Verification codes expire in 5 minutes
- Magic links expire in 60 minutes
- All unused tokens are cleaned up daily
- Consider adding rate limiting for production
- Use HTTPS for all webhook URLs
