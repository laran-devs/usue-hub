import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, shuffleNickname } from "@/lib/auth";

/**
 * Verifies the 6-digit code sent to the student's email.
 */
export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "GATEWAY_ERROR", message: "Email and token are required." }, { status: 400 });
    }

    // 1. Check Security Token
    const storedToken = await prisma.verificationToken.findFirst({
      where: { email, token },
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: "INVALID_CODE", message: "Verification sequence mismatch." },
        { status: 400 }
      );
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: storedToken.id } });
      return NextResponse.json(
        { error: "CODE_EXPIRED", message: "Security token has expired. Request a new one." },
        { status: 400 }
      );
    }

    // 2. Finalize Identity
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "IDENTITY_NOT_FOUND", message: "User record missing." }, { status: 404 });
    }

    // 3. Update User State & Shuffle Anonymous Identity
    const prefix = email.split("@")[0];
    const anonymousNickname = shuffleNickname(prefix);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        nickname: anonymousNickname
      },
    });

    // 4. Cleanup single-use token
    await prisma.verificationToken.delete({ where: { id: storedToken.id } });

    // 5. Establish Session
    await createSession(user.id);

    return NextResponse.json({ 
      success: true, 
      message: "Access granted. Identity verified and anonymized.",
      nickname: anonymousNickname 
    });

  } catch (error) {
    console.error("Verification crash:", error);
    return NextResponse.json({ error: "INTERNAL_GATEWAY_ERROR", message: "Processing failure." }, { status: 500 });
  }
}
