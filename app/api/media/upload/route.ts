import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth/server";

/**
 * Accepts a raw image upload and stores it directly in Neon Postgres (see
 * the `images` table) rather than an external object store — keeps the
 * whole stack on one connection string, at the cost of every request for
 * the image being served through this app instead of a CDN edge.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }

  const width = Number(request.headers.get("x-image-width"));
  const height = Number(request.headers.get("x-image-height"));
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return NextResponse.json({ error: "Missing image dimensions." }, { status: 400 });
  }

  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.length === 0) {
    return NextResponse.json({ error: "Empty upload." }, { status: 400 });
  }

  const rows = (await sql`
    insert into images (data, content_type, width, height)
    values (${bytes}, ${contentType}, ${width}, ${height})
    returning id
  `) as unknown as { id: string }[];

  return NextResponse.json({ id: rows[0].id, width, height });
}
