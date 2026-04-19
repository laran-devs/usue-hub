import { NextResponse } from "next/server";
import { sendBotMessage } from "@/lib/bot";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret_underground_key_777");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message || body.callback_query?.message;
    const from = body.message?.from || body.callback_query?.from;

    if (!message || !from) {
      return NextResponse.json({ ok: true });
    }

    const chatId = from.id;
    const text = body.message?.text || "";

    if (text.startsWith("/start")) {
      // 1. Generate short-lived auth token (5 minutes)
      const token = await new SignJWT({ 
        id: String(from.id),
        username: from.username || `user_${from.id}`,
        first_name: from.first_name,
        auth_date: Math.floor(Date.now() / 1000)
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(JWT_SECRET);

      // 2. Prepare Secure URL
      const loginUrl = `${SITE_URL}/api/auth/verify?token=${token}`;
      
      // 3. Respond with Login Button
      await sendBotMessage(chatId, 
        `<b>USUE.HUB GATEWAY</b>\n\n` +
        `Ваш запрос на вход через независимый канал получен.\n` +
        `Нажмите на кнопку ниже, чтобы завершить авторизацию.\n\n` +
        `<i>* Ссылка действительна 5 минут.</i>`,
        {
          inline_keyboard: [[
            { text: "⚡️ ПРОЙТИ НА ПОРТАЛ", url: loginUrl }
          ]]
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook logic crashed:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
