import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

/**
 * Handles account registration for USUE students.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Domain Validation
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "REGISTER_FAILED", message: "Allowed only for @usue.ru domain." },
        { status: 400 }
      );
    }

    // 2. Password Safety check
    if (!validatePassword(password)) {
      return NextResponse.json(
        { 
          error: "WEAK_PASSWORD", 
          message: "Rules: 8+ chars, 1 number, 1 special character." 
        },
        { status: 400 }
      );
    }

    // 3. Check availability
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "ALREADY_EXISTS", message: "This unit identity is already registered." },
        { status: 400 }
      );
    }

    // 4. Generate Security Package
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isVerified: false,
      },
    });

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes limit
      },
    });

    // 5. Deploy Verification Code
    const sent = await sendVerificationEmail(email, token);
    
    if (!sent) {
        console.error("Verification email failed dispatch.");
    }

    return NextResponse.json({ 
      success: true,
      message: "Gateway: Verification code sent to academic terminal.", 
      email 
    });

  } catch (error) {
    console.error("Registration crash:", error);
    return NextResponse.json(
      { error: "INTERNAL_CORE_ERROR", message: "Gateway processing failure." },
      { status: 500 }
    );
  }
}
