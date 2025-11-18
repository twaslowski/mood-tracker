const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;

export const markdownEscape = (text: string): string => {
  return text.replace(/(_)/g, "\\$1");
};

export async function sendTelegramMessage(chatId: number, text: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        link_preview_options: {
          is_disabled: true,
        },
      }),
    },
  );
  return response.json();
}

export async function sendError(chatId: number) {
  await sendTelegramMessage(chatId, "❌ An error occurred. Please try again.");
}
