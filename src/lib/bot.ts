const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Sends a message via the Telegram Bot API.
 */
export async function sendBotMessage(chatId: string | number, text: string, replyMarkup?: any) {
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing in environment variables.");
    return null;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: replyMarkup,
        parse_mode: "HTML",
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send bot message:", error);
    return null;
  }
}

/**
 * Utility to set the webhook for the bot.
 */
export async function setWebhook(url: string) {
  if (!BOT_TOKEN) return null;
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`);
  return await response.json();
}
