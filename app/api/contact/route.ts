import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/data";
import type { ContactMessageInput } from "@/types";

export async function POST(request: Request) {
  let body: Partial<ContactMessageInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  // TODO(build order step 7): email the admin via Resend once connected.
  await createContactMessage({ name, email, message });

  return NextResponse.json({ ok: true });
}
