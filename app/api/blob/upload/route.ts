import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session?.user || session.user.role !== "admin") {
          throw new Error("Not authorized.");
        }
        return { addRandomSuffix: true };
      },
      onUploadCompleted: async () => {
        // No server-side follow-up needed — the client picks up the
        // returned blob URL directly and submits it with the rest of the form.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
