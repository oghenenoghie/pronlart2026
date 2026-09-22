"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getSellSubmissionById, updateSellSubmissionStatus, type SellSubmissionStatus } from "@/lib/data";
import { slugify } from "@/lib/utils";

export async function setSellSubmissionStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as SellSubmissionStatus;
  await updateSellSubmissionStatus(id, status);
  revalidatePath("/admin/submissions");
}

/**
 * Creates a real artworks row from a submission (resolving/creating the
 * artist by name — no auto-fetched portrait here: this is a real submitting
 * artist, and a name-matched photo from an external source could easily be
 * the wrong person). The submission never collects year, materials or an
 * image, so this only gets the artwork to a draft state — redirects
 * straight to its edit page to finish it.
 */
export async function convertSubmissionToArtwork(id: string) {
  const submission = await getSellSubmissionById(id);
  if (!submission) throw new Error("Submission not found.");
  if (!submission.movement_id || !submission.medium_id) {
    throw new Error("This submission is missing its movement or medium — create the artwork manually.");
  }

  const artistSlug = slugify(submission.artist_name);
  const existing = (await sql`select id from artists where slug = ${artistSlug}`) as unknown as { id: string }[];

  let artistId = existing[0]?.id;
  if (!artistId) {
    const inserted = (await sql`
      insert into artists (slug, name, status) values (${artistSlug}, ${submission.artist_name}, 'active')
      returning id
    `) as unknown as { id: string }[];
    artistId = inserted[0].id;
  }

  const artworkSlug = `${slugify(submission.title)}-${submission.id.slice(0, 8)}`;

  const artwork = (await sql`
    insert into artworks (slug, title, artist_id, movement_id, medium_id, year, dimensions, materials, description, price, currency, status, featured, images)
    values (
      ${artworkSlug}, ${submission.title}, ${artistId}, ${submission.movement_id}, ${submission.medium_id},
      ${new Date().getFullYear()}, ${submission.dimensions}, ${submission.medium?.name ?? "Mixed media"},
      ${submission.message ?? ""}, ${submission.asking_price}, ${submission.currency}, 'available', false, '[]'
    )
    returning id
  `) as unknown as { id: string }[];

  if (submission.status !== "accepted") {
    await updateSellSubmissionStatus(id, "accepted");
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect(`/admin/artworks/${artwork[0].id}/edit`);
}
