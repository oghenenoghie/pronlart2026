import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Serves image bytes stored directly in Neon Postgres. Rows are immutable — every upload gets a new id — so the response can be cached forever. */
export async function GET(_request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const rows = (await sql`
    select data, content_type from images where id = ${params.id}
  `) as unknown as { data: Buffer; content_type: string }[];

  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.content_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
