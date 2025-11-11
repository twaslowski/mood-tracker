import { supabase, APP_URL } from "./config.ts";
import { sendTelegramMessage, markdownEscape, sendError } from "./telegram.ts";

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if Telegram account is already linked
export async function isAccountLinked(telegramId: number): Promise<boolean> {
  const { data } = await supabase
    .from("telegram_accounts")
    .select("telegram_id")
    .eq("telegram_id", telegramId)
    .single();

  return !!data;
}

// Generate and store verification code for new users
export async function handleNewUser(telegramId: number, chatId: number) {
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
    await sendError(chatId);
    return;
  }

  const redirectUrl = markdownEscape(
    `${APP_URL}/auth/telegram/link?telegram_id=${telegramId}&verification_code=${code}`,
  );
  const result = await sendTelegramMessage(
    chatId,
    `🔐 *Welcome!*\n\nTo link your account, enter this code on the website:\n\n\`${code}\`\n\n⏱ This code expires in 5 minutes.\n\n🌐 Go to: ${redirectUrl}`,
  );

  if (!result.ok) {
    console.error("Error sending verification code:", result.description);
    await sendError(chatId);
  }
}

export async function handleExistingUser(telegramId: number, chatId: number) {
  const { data: telegramAccount, error: findUserError } = await supabase
    .from("telegram_accounts")
    .select("user_id")
    .eq("telegram_id", telegramId)
    .single();

  const userId = telegramAccount?.user_id;
  if (findUserError || !userId) {
    console.error("Error fetching linked user:", findUserError);
    await sendError(chatId);
    return;
  }

  console.log(`Generating magic link for user ID: ${userId}`);

  const { data: user, error: authError } =
    await supabase.auth.admin.getUserById(userId);
  if (authError || !user.user?.email) {
    console.error("Error fetching user info:", authError);
    await sendError(chatId);
    return;
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: user.user.email,
    options: {
      redirectTo: APP_URL,
    },
  });

  if (error || !data || !data.properties?.action_link) {
    console.error("Error generating magic link:", error);
    await sendError(chatId);
    return;
  }

  const link = markdownEscape(data.properties.action_link);

  const result = await sendTelegramMessage(
    telegramId,
    `🔗 *Sign In Link*\n\nClick below to sign in:\n\n${link}\n\n⏱ This link expires in 60 minutes.`,
  );

  if (!result.ok) {
    throw Error(result.description);
  }
}
