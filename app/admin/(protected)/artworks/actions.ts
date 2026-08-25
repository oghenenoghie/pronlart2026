"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseToMinorUnits } from "@/lib/money";
import { slugify } from "@/lib/utils";
import type { Database, Json } from "@/types/supabase";

type ArtworkInsert = Database["public"]["Tables"]["artworks"]["Insert"];

function buildArtworkPayload(formData: FormData): ArtworkInsert {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const currency = String(formData.get("currency") ?? "NGN").trim() || "NGN";
  const editionRaw = String(formData.get("edition") ?? "").trim();

  const imagePath = String(formData.get("imagePath") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || title;
  const imageWidth = Number(formData.get("imagePathWidth") ?? 0) || 1200;
  const imageHeight = Number(formData.get("imagePathHeight") ?? 0) || 1500;

  const images = imagePath
    ? [{ path: imagePath, alt: imageAlt, isPrimary: true, width: imageWidth, height: imageHeight }]
    : [];

  return {
    title,
    slug: slugInput || slugify(title),
    artist_id: String(formData.get("artistId") ?? ""),
    movement_id: String(formData.get("movementId") ?? ""),
    medium_id: String(formData.get("mediumId") ?? ""),
    year: Number(formData.get("year") ?? 0),
    dimensions: String(formData.get("dimensions") ?? "").trim(),
    materials: String(formData.get("materials") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: priceRaw ? parseToMinorUnits(priceRaw, currency) : null,
    currency,
    edition: editionRaw || null,
    status: String(formData.get("status") ?? "available") as Database["public"]["Enums"]["artwork_status"],
    featured: formData.get("featured") === "on",
    images: images as unknown as Json,
  };
}

export async function createArtwork(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("artworks").insert(buildArtworkPayload(formData));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect("/admin/artworks");
}

export async function updateArtwork(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("artworks").update(buildArtworkPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect("/admin/artworks");
}

export async function deleteArtwork(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
}
