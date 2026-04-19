import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if (!BOT_TOKEN || !SITE_URL) {
    return NextResponse.json({ 
      error: "Missing environment variables", 
      BOT_TOKEN: !!BOT_TOKEN, 
      SITE_URL: !!SITE_URL 
    }, { status: 500 });
  }

  const WEBHOOK_URL = `${SITE_URL}/api/webhook/telegram`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`);
    const data = await response.json();

    return NextResponse.json({
      message: "Webhook setup triggered from Vercel server",
      telegram_response: data,
      webhook_url: WEBHOOK_URL
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Vercel server failed to reach Telegram", 
      details: error.message 
    }, { status: 500 });
  }
}
