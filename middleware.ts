import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "neon_session";

// Cheap existence check only — the public site never depends on the auth
// server being reachable. Full session/role verification happens in
// requireAdmin() on each protected page.
export function middleware(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
