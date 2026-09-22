import { NextResponse } from "next/server";
import { createSellSubmission, getMedium, getMovement } from "@/lib/data";
import { parseToMinorUnits } from "@/lib/money";
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
  const movementRow = movement ? await getMovement(movement) : undefined;
  if (!movementRow) {
    return NextResponse.json({ error: "Unknown movement." }, { status: 400 });
  }
  const mediumRow = medium ? await getMedium(medium) : undefined;
  if (!mediumRow) {
    return NextResponse.json({ error: "Unknown medium." }, { status: 400 });
  }
  if (!dimensions?.trim()) {
    return NextResponse.json({ error: "Dimensions are required." }, { status: 400 });
  }

  // TODO(build order step 7): image upload from this form + email the admin
  // via Resend once connected. Images can be added later from /admin.
  await createSellSubmission({
    artistName,
    artistEmail,
    title,
    movementId: movementRow.id,
    mediumId: mediumRow.id,
    dimensions,
    askingPrice: askingPrice?.trim() ? parseToMinorUnits(askingPrice, "NGN") : undefined,
    message,
  });

  return NextResponse.json({ ok: true });
}
