import { NextResponse } from "next/server";
import { signInWithEmail } from "@/lib/auth/server";

/** Temporary diagnostic: confirms sign-in works end-to-end. Remove after use. */
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

  const result = await signInWithEmail(email, password);
  return NextResponse.json(result);
}
