import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * One-time admin bootstrap endpoint. Self-disables once neon_auth.user has
 * any row, so it stays safe to leave deployed briefly even on a public repo.
 * Delete this route once the first admin account exists.
 */
const BOOTSTRAP_TOKEN = "um-3njioQVKRYbQjeSUkgR-_iOljmPLD";
const TRUSTED_ORIGIN = "https://pronlart2026.vercel.app";

async function bootstrap(
  email: string | null,
  password: string | null,
  name: string | null,
  authBaseUrl: string | null
) {
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  if (!authBaseUrl) {
    let existingCount: number | null = null;
    try {
      const existing = (await sql`select count(*)::int as count from neon_auth."user"`) as unknown as {
        count: number;
      }[];
      existingCount = existing[0].count;
    } catch {
      existingCount = null; // DATABASE_URL may not point at the right branch; don't block sign-up on it.
    }
    if (existingCount !== null && existingCount > 0) {
      return NextResponse.json({ error: "already bootstrapped" }, { status: 409 });
    }
  }

  const baseUrl = authBaseUrl || process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "no auth base URL available" }, { status: 500 });
  }

  const signUpRes = await fetch(`${baseUrl}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: TRUSTED_ORIGIN },
    body: JSON.stringify({ email, password, name: name ?? "Pronlart Admin" }),
  });
  const signUpBody = await signUpRes.json().catch(() => null);
  if (!signUpRes.ok) {
    return NextResponse.json(
      { error: signUpBody?.message ?? "sign-up failed", status: signUpRes.status },
      { status: 502 }
    );
  }

  let promoted = false;
  try {
    await sql`update neon_auth."user" set role = 'admin' where email = ${email}`;
    promoted = true;
  } catch {
    promoted = false;
  }

  return NextResponse.json({ ok: true, userId: signUpBody?.user?.id ?? null, promoted });
}

export async function POST(request: Request) {
  if (request.headers.get("x-bootstrap-token") !== BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { email?: string; password?: string; name?: string; authBaseUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  return bootstrap(body.email ?? null, body.password ?? null, body.name ?? null, body.authBaseUrl ?? null);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("token") !== BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return bootstrap(params.get("email"), params.get("password"), params.get("name"), params.get("authBaseUrl"));
}
