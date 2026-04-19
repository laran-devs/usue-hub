import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret_underground_key_777");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public assets, login page, and api auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname.includes(".") // Static files like images, fonts, etc.
  ) {
    return NextResponse.next();
  }

  // 2. Check for session
  const session = request.cookies.get("auth_session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Verify session
  try {
    await jwtVerify(session, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Session expired or invalid
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_session");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
