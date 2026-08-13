import { NextResponse } from "next/server";
import { getMedium, getMovement } from "@/lib/data";
import type { SellSubmissionInput } from "@/types";

export async function POST(request: Request) {
  let body: Partial<SellSubmissionInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { artistName, artistEmail, title, movement, medium, dimensions, askingPrice, message } = body;

  if (!artistName?.trim() || !artistEmail?.trim()) {
    return NextResponse.json({ error: "Artist name and email are required." }, { status: 400 });
  }
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!movement || !(await getMovement(movement))) {
    return NextResponse.json({ error: "Unknown movement." }, { status: 400 });
  }
  if (!medium || !(await getMedium(medium))) {
    return NextResponse.json({ error: "Unknown medium." }, { status: 400 });
  }
  if (!dimensions?.trim()) {
    return NextResponse.json({ error: "Dimensions are required." }, { status: 400 });
  }

  // TODO(build order step 2/7): upload images to Supabase Storage, insert
  // into `sell_submissions` as status=pending, and email the admin via
  // Resend once those are connected. For now this just validates and logs.
  console.info("[sell-submit]", { artistName, artistEmail, title, movement, medium, dimensions, askingPrice, message });

  return NextResponse.json({ ok: true });
}
