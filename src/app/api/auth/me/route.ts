import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, generateRandomNickname, createSession } from "@/lib/auth";

export async function GET() {
  try {
    let session = await getSession();
    
    // If no session, create a Guest Session
    if (!session) {
      const guestNickname = generateRandomNickname();
      const guestEmail = `guest_${Math.random().toString(36).slice(2)}@usue.ru`;
      
      // Create a guest user record
      const guestUser = await prisma.user.create({
        data: {
          email: guestEmail,
          passwordHash: "GUEST_NO_PASSWORD", // Secure enough since we don't have login for guests yet
          nickname: guestNickname,
          isVerified: true,
        }
      });
      
      await createSession(guestUser.id);
      
      return NextResponse.json({
        authenticated: true,
        isGuest: true,
        user: {
          id: guestUser.id,
          nickname: guestUser.nickname,
          avatarUrl: null,
          institute: null,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { institute: true },
    });

    if (!user) {
      // If session exists but user is deleted, treat as new guest
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      isGuest: user.passwordHash === "GUEST_NO_PASSWORD",
      user: {
        id: user.id,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        institute: user.institute?.name,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
