import { NextResponse } from "next/server";

/** Temporary diagnostic: inspects the raw Neon Auth sign-in response. Remove after use. */
const CHECK_TOKEN = "ADysdCXzpBhDHfsElHG0G9aYFD7SV7qC";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("token") !== CHECK_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const email = params.get("email");
  const password = params.get("password");
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const res = await fetch(`${baseUrl}/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://pronlart2026.vercel.app" },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => null);
  const setCookieViaGetSetCookie =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : "getSetCookie unsupported";
  const setCookieSingle = res.headers.get("set-cookie");
  const allHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return NextResponse.json({
    ok: res.ok,
    status: res.status,
    body,
    setCookieViaGetSetCookie,
    setCookieSingle,
    allHeaders,
  });
}
