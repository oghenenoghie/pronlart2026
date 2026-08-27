import "server-only";
import { cookies } from "next/headers";

/**
 * Neon Auth (Managed Better Auth) integration, called directly over its
 * REST API rather than via the `@neondatabase/auth` SDK — that package
 * requires Next.js 16+, and this app is on 14. See
 * https://neon.com/docs/auth/authentication-flow for the documented
 * contract this follows.
 *
 * The auth server lives on its own domain (`ep-....neonauth....neon.tech`),
 * so its session cookie is scoped there, not to this app. We capture that
 * cookie's value on sign-in and re-host it under our own cookie name/domain,
 * then replay it back to the auth server's own endpoints on every
 * server-side session check — exactly what a browser calling the auth
 * server directly would have sent.
 */

const SESSION_COOKIE = "neon_session";
const UPSTREAM_COOKIE_NAME = "__Secure-neonauth.session_token";

function baseUrl(): string {
  const url = process.env.NEON_AUTH_BASE_URL;
  if (!url) throw new Error("NEON_AUTH_BASE_URL is not set");
  return url;
}

/**
 * Better Auth rejects email/password requests with no callbackURL unless an
 * Origin header is present (it uses Origin against trustedOrigins as its
 * CSRF check) — a browser sends this automatically, but our server-side
 * fetch to the auth server doesn't unless we set it explicitly.
 */
function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://pronlart2026.vercel.app";
}

function extractUpstreamSessionCookie(res: Response): string | null {
  const cookieStrings =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [res.headers.get("set-cookie") ?? ""];

  for (const cookieString of cookieStrings) {
    const match = cookieString.match(new RegExp(`${UPSTREAM_COOKIE_NAME}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

export type NeonAuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
};

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const res = await fetch(`${baseUrl()}/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: siteOrigin() },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return { error: body?.message ?? "Invalid email or password." };
  }

  const sessionToken = extractUpstreamSessionCookie(res);
  if (!sessionToken) {
    return { error: "Sign in succeeded but no session was returned. Try again." };
  }

  cookies().set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { error: null };
}

export async function signOut(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await fetch(`${baseUrl()}/sign-out`, {
      method: "POST",
      headers: { cookie: `${UPSTREAM_COOKIE_NAME}=${token}`, Origin: siteOrigin() },
    }).catch(() => undefined);
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ user: NeonAuthUser } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const res = await fetch(`${baseUrl()}/get-session`, {
    headers: { cookie: `${UPSTREAM_COOKIE_NAME}=${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const body = await res.json().catch(() => null);
  if (!body?.user) return null;

  return {
    user: {
      id: body.user.id,
      email: body.user.email,
      name: body.user.name ?? null,
      role: body.user.role ?? null,
    },
  };
}
