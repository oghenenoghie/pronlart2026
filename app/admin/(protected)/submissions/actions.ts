"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellSubmissionById, updateSellSubmissionStatus } from "@/lib/data";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/supabase";

export async function setSellSubmissionStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as Database["public"]["Enums"]["sell_submission_status"];
  await updateSellSubmissionStatus(id, status);
  revalidatePath("/admin/submissions");
}

/**
 * Creates a real artworks row from a submission (resolving/creating the
 * artist by name — no auto-fetched portrait here, unlike the seed script:
 * this is a real submitting artist, and a name-matched photo from an
 * external source could easily be the wrong person). The submission never
 * collects year, materials or an image, so this only gets the artwork to a
 * draft state — redirects straight to its edit page to finish it.
 */
export async function convertSubmissionToArtwork(id: string) {
  const submission = await getSellSubmissionById(id);
  if (!submission) throw new Error("Submission not found.");
  if (!submission.movement_id || !submission.medium_id) {
    throw new Error("This submission is missing its movement or medium — create the artwork manually.");
  }

  const supabase = createClient();

  const artistSlug = slugify(submission.artist_name);
  const { data: existingArtist, error: artistSelErr } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", artistSlug)
    .maybeSingle();
  if (artistSelErr) throw new Error(artistSelErr.message);

  let artistId = existingArtist?.id;
  if (!artistId) {
    const { data: newArtist, error: artistInsErr } = await supabase
      .from("artists")
      .insert({ slug: artistSlug, name: submission.artist_name, status: "active" })
      .select("id")
      .single();
    if (artistInsErr) throw new Error(artistInsErr.message);
    artistId = newArtist.id;
  }

  const artworkSlug = `${slugify(submission.title)}-${submission.id.slice(0, 8)}`;

  const { data: artwork, error: artworkErr } = await supabase
    .from("artworks")
    .insert({
      slug: artworkSlug,
      title: submission.title,
      artist_id: artistId,
      movement_id: submission.movement_id,
      medium_id: submission.medium_id,
      year: new Date().getFullYear(),
      dimensions: submission.dimensions,
      materials: submission.medium?.name ?? "Mixed media",
      description: submission.message ?? "",
      price: submission.asking_price,
      currency: submission.currency,
      status: "available",
      featured: false,
      images: [],
    })
    .select("id")
    .single();
  if (artworkErr) throw new Error(artworkErr.message);

  if (submission.status !== "accepted") {
    await supabase.from("sell_submissions").update({ status: "accepted" }).eq("id", id);
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect(`/admin/artworks/${artwork.id}/edit`);
}
