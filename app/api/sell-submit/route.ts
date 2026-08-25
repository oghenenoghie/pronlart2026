import { NextResponse } from "next/server";
import { getMovementBySlug } from "@/lib/movements";
import { createSellSubmission } from "@/lib/data";
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
  const movementRecord = movement ? getMovementBySlug(movement) : undefined;
  if (!movementRecord) {
    return NextResponse.json({ error: "Unknown movement." }, { status: 400 });
  }
  if (!medium?.trim() || !dimensions?.trim()) {
    return NextResponse.json({ error: "Medium and dimensions are required." }, { status: 400 });
  }

  await createSellSubmission({
    artistName,
    artistEmail,
    title,
    movementId: movementRecord.id,
    medium,
    dimensions,
    askingPrice,
    message,
  });

  return NextResponse.json({ ok: true });
}
