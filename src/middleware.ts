import { NextResponse, type NextRequest } from "next/server";

// Lightweight, edge-safe gate: only checks that a session cookie is present so
// unauthenticated visitors are redirected before any page code runs. Firebase
// Admin cannot run on the Edge runtime, so the cookie is fully verified (role,
// revocation, tenant) server-side in each protected layout — see
// src/lib/auth/session.ts. This middleware is a fast UX guard, not the
// security boundary.
const SESSION_COOKIE_NAME = "cdf_session";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const url = new URL("/connexion", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portail/:path*", "/admin/:path*"],
};
