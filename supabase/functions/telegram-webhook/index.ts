import { TelegramUpdate } from "./types.ts";
import { sendTelegramMessage } from "./telegram.ts";
import { isAccountLinked, handleNewUser, handleExistingUser } from "./auth.ts";

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
