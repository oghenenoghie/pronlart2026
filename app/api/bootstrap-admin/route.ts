import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * One-time admin bootstrap endpoint. Self-disables once neon_auth.user has
 * any row, so it stays safe to leave deployed briefly even on a public repo.
 * Delete this route once the first admin account exists.
 */
const BOOTSTRAP_TOKEN = "um-3njioQVKRYbQjeSUkgR-_iOljmPLD";

async function bootstrap(email: string | null, password: string | null, name: string | null) {
  const existing = (await sql`select count(*)::int as count from neon_auth."user"`) as unknown as { count: number }[];
  if (existing[0].count > 0) {
    return NextResponse.json({ error: "already bootstrapped" }, { status: 409 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "NEON_AUTH_BASE_URL is not set" }, { status: 500 });
  }

  const signUpRes = await fetch(`${baseUrl}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name: name ?? "Pronlart Admin" }),
  });
  const signUpBody = await signUpRes.json().catch(() => null);
  if (!signUpRes.ok) {
    return NextResponse.json(
      { error: signUpBody?.message ?? "sign-up failed", status: signUpRes.status },
      { status: 502 }
    );
  }

  await sql`update neon_auth."user" set role = 'admin' where email = ${email}`;

  return NextResponse.json({ ok: true, userId: signUpBody?.user?.id ?? null });
}

export async function POST(request: Request) {
  if (request.headers.get("x-bootstrap-token") !== BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { email?: string; password?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  return bootstrap(body.email ?? null, body.password ?? null, body.name ?? null);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("token") !== BOOTSTRAP_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return bootstrap(params.get("email"), params.get("password"), params.get("name"));
}
