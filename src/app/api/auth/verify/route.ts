import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { createSession, shuffleNickname } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret_underground_key_777");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=MissingToken", request.url));
  }

  try {
    // 1. Verify the deep link token
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    
    const data = payload as { id: string, username: string };
    const telegramId = data.id;
    const username = data.username;

    // 2. Standard user registration/login logic
    let user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      // First time entry
      const initialNickname = shuffleNickname(username);
      user = await prisma.user.create({
        data: {
          telegramId,
          telegramUsername: username,
          nickname: initialNickname,
        },
      });
      console.log(`Deep Link Registration: ${telegramId} as ${initialNickname}`);
    } else {
      // Update username if changed
      await prisma.user.update({
        where: { id: user.id },
        data: { telegramUsername: username }
      });
    }

    // 3. Create session cookie
    await createSession(user.id);

    // 4. Final redirect to the hub
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Deep-link auth failure:", error);
    return NextResponse.redirect(new URL("/login?error=InvalidOrExpiredToken", request.url));
  }
}
