import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramAuth, createSession, shuffleNickname } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = Object.fromEntries(searchParams.entries());

  // 1. Verify Telegram Data
  if (!verifyTelegramAuth(data)) {
    return NextResponse.redirect(new URL("/login?error=InvalidAuth", request.url));
  }

  const telegramId = data.id as string;
  const username = data.username as string || `user_${telegramId}`;
  const avatarUrl = data.photo_url as string || null;

  try {
    // 2. Find or Create User
    let user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      // New user registration - shuffle nickname once
      const initialNickname = shuffleNickname(username);
      user = await prisma.user.create({
        data: {
          telegramId,
          telegramUsername: username,
          nickname: initialNickname,
          avatarUrl,
        },
      });
      console.log(`New unit registered: ${telegramId} -> ${initialNickname}`);
    } else {
      // Update existing user (optional: update avatar/username)
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          telegramUsername: username,
          avatarUrl,
        },
      });
    }

    // 3. Create Session
    await createSession(user.id);

    // 4. Redirect to Hub
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Authentication crash:", error);
    return NextResponse.redirect(new URL("/login?error=ServerCrash", request.url));
  }
}
