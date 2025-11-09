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

// Generate a secure magic link token
function generateMagicToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
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

  await sendTelegramMessage(
    chatId,
    `🔐 *Welcome!*\n\nTo link your account, enter this code on the website:\n\n\`${code}\`\n\n⏱ This code expires in 5 minutes.\n\n🌐 Go to: ${APP_URL}/auth/telegram/link`,
  );
}

// Generate magic link for existing users
async function handleExistingUser(telegramId: number, chatId: number) {
  const token = generateMagicToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

  // Store magic link token
  const { error } = await supabase.from("magic_tokens").insert({
    token,
    telegram_id: telegramId,
    expires_at: expiresAt.toISOString(),
    used: false,
  });

  if (error) {
    console.error("Error storing magic token:", error);
    await sendTelegramMessage(
      chatId,
      "❌ An error occurred. Please try again.",
    );
    return;
  }

  const magicLink = `${APP_URL}/auth/telegram/link?token=${token}`;

  await sendTelegramMessage(
    chatId,
    `🔗 *Sign In Link*\n\nClick below to sign in:\n\n${magicLink}\n\n⏱ This link expires in 60 minutes.`,
  );
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

    console.log("Received message:", text, "from user:", telegramId);

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
