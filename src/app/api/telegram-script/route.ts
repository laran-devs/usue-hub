import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://telegram.org/js/telegram-widget.js?22", {
      next: { revalidate: 3600 }, // Cache for 1 hour on Vercel
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch script: ${response.statusText}`);
    }

    const scriptText = await response.text();

    return new Response(scriptText, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Telegram Script Proxy Error:", error);
    return new NextResponse("Error loading script", { status: 500 });
  }
}
