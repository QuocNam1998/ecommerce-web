import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/orders", "/checkout", "/admin"];

const SESSION_COOKIE_NAMES = ["connect.sid", "session", "auth-token", "token"];

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  return SESSION_COOKIE_NAMES.some((name) => cookies.has(name)) ||
    Array.from(cookies.getAll()).some(
      (cookie) =>
        cookie.name.includes("session") || cookie.name.includes("token")
    );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
