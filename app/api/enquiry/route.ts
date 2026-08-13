import { NextResponse } from "next/server";
import { getArtwork } from "@/lib/data";
import type { EnquiryInput } from "@/types";

export async function POST(request: Request) {
  let body: Partial<EnquiryInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { type, artworkSlug, name, email, message, offer } = body;

  if (type !== "purchase" && type !== "enquiry") {
    return NextResponse.json({ error: "type must be 'purchase' or 'enquiry'." }, { status: 400 });
  }
  if (!artworkSlug || !(await getArtwork(artworkSlug))) {
    return NextResponse.json({ error: "Unknown artwork." }, { status: 400 });
  }
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // TODO(build order step 2/7): insert into Supabase `enquiries` and email
  // the admin via Resend once those are connected. For now this just
  // validates and logs, so the form is real end-to-end and ready to wire up.
  console.info("[enquiry]", { type, artworkSlug, name, email, message, offer });

  return NextResponse.json({ ok: true });
}
