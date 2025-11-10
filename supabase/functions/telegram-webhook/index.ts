import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface TelegramUpdate {
  message?: {
    from: {
      id: number;
      username?: string;
      first_name: string;
    };
    text: string;
    chat: { id: number };
  };
}

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send message via Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    },
  );
  return response.json();
}

// Check if Telegram account is already linked
async function isAccountLinked(telegramId: number): Promise<boolean> {
  const { data } = await supabase
    .from("telegram_accounts")
    .select("telegram_id")
    .eq("telegram_id", telegramId)
    .single();

  return !!data;
}

// Generate and store verification code for new users
async function handleNewUser(telegramId: number, chatId: number) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store verification code
  const { error } = await supabase.from("verification_codes").insert({
    telegram_id: telegramId,
    code,
    expires_at: expiresAt.toISOString(),
    used: false,
  });

  if (error) {
    console.error("Error storing verification code:", error);
    await sendTelegramMessage(
      chatId,
      "❌ An error occurred. Please try again.",
    );
    return;
  }

  const redirectUrl = `${APP_URL}/auth/telegram/link?telegram_id=${telegramId}&verification_code=${code}`;
  await sendTelegramMessage(
    chatId,
    `🔐 *Welcome!*\n\nTo link your account, enter this code on the website:\n\n\`${code}\`\n\n⏱ This code expires in 5 minutes.\n\n🌐 Go to: ${redirectUrl}`,
  );
}

async function handleExistingUser(telegramId: number) {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: `${telegramId}@placeholder.local`,
    options: {
      redirectTo: `${APP_URL}/auth/callback`,
    },
  });

  if (error || !data || !data.properties?.action_link) {
    console.error("Error generating magic link:", error);
    await sendTelegramMessage(
      chatId,
      "❌ An error occurred while generating your sign-in link. Please try again.",
    );
    return;
  }

  const link = encodeURI(data.properties.action_link);
  console.log(telegramId, link);

  // todo: underscores break and have to be escaped in telegram markdown
  const result = await sendTelegramMessage(
    telegramId,
    `🔗 *Sign In Link*\n\nClick below to sign in:\n\nhttp://127.0.0.1:54321/auth/v1/verify?token=d7fe26c860ac234c3f05ec18e4205f61d08ade408e0e46cd02e922dd&type=signup&redirect_to=http://127.0.0.1:3000\n\n⏱ This link expires in 60 minutes.`,
  );
  console.log("Telegram send result:", result);
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const update: TelegramUpdate = await req.json();

    // Ignore non-message updates
    if (!update.message || !update.message.text) {
      return new Response("OK", { status: 200 });
    }

    const { from, text, chat } = update.message;
    const telegramId = from.id;
    const chatId = chat.id;

    console.log(`Received message '${text}' from user ${telegramId}`);

    // Handle /start or /login commands
    if (text === "/start" || text === "/login") {
      const linked = await isAccountLinked(telegramId);

      if (linked) {
        await handleExistingUser(telegramId, chatId);
      } else {
        await handleNewUser(telegramId, chatId);
      }
    } else {
      // Help message for unknown commands
      await sendTelegramMessage(
        chatId,
        "Send /start to begin or /login to get a sign-in link.",
      );
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
