import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSession } from "@/lib/auth";

/**
 * Handles security clearance via email and password credentials.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Email and password are required for initialization." },
        { status: 400 }
      );
    }

    // 1. Identity Check
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security practice: Return generic error
      return NextResponse.json(
        { error: "INVALID_ACCESS", message: "Negative identification. Check credentials." },
        { status: 401 }
      );
    }

    // 2. Cryptographic Matching
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "INVALID_ACCESS", message: "Negative identification. Check credentials." },
        { status: 401 }
      );
    }

    // 3. Check Authorization Status
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          error: "UNVERIFIED_IDENTITY", 
          message: "Secure sector requires email verification before entry." 
        },
        { status: 403 }
      );
    }

    // 4. Establish Secure Session
    await createSession(user.id);

    return NextResponse.json({ 
      success: true, 
      message: "Gateway sequence successful. Session active." 
    });

  } catch (error) {
    console.error("Login processing failure:", error);
    return NextResponse.json(
      { error: "INTERNAL_CORE_ERROR", message: "Gateway processing failure." },
      { status: 500 }
    );
  }
}
