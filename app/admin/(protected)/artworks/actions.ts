"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { parseToMinorUnits } from "@/lib/money";
import { slugify } from "@/lib/utils";
import type { ArtworkImage, ArtworkStatus } from "@/types";

type ArtworkPayload = {
  title: string;
  slug: string;
  artistId: string;
  movementId: string;
  mediumId: string;
  year: number;
  dimensions: string;
  materials: string;
  description: string;
  price: number | null;
  currency: string;
  edition: string | null;
  status: ArtworkStatus;
  featured: boolean;
  images: ArtworkImage[];
};

function buildArtworkPayload(formData: FormData): ArtworkPayload {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const currency = String(formData.get("currency") ?? "NGN").trim() || "NGN";
  const editionRaw = String(formData.get("edition") ?? "").trim();

  const imagePath = String(formData.get("imagePath") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || title;
  const imageWidth = Number(formData.get("imagePathWidth") ?? 0) || 1200;
  const imageHeight = Number(formData.get("imagePathHeight") ?? 0) || 1500;

  const images: ArtworkImage[] = imagePath
    ? [{ path: imagePath, alt: imageAlt, isPrimary: true, width: imageWidth, height: imageHeight }]
    : [];

  return {
    title,
    slug: slugInput || slugify(title),
    artistId: String(formData.get("artistId") ?? ""),
    movementId: String(formData.get("movementId") ?? ""),
    mediumId: String(formData.get("mediumId") ?? ""),
    year: Number(formData.get("year") ?? 0),
    dimensions: String(formData.get("dimensions") ?? "").trim(),
    materials: String(formData.get("materials") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: priceRaw ? parseToMinorUnits(priceRaw, currency) : null,
    currency,
    edition: editionRaw || null,
    status: String(formData.get("status") ?? "available") as ArtworkStatus,
    featured: formData.get("featured") === "on",
    images,
  };
}

export async function createArtwork(formData: FormData) {
  const p = buildArtworkPayload(formData);
  await sql`
    insert into artworks (title, slug, artist_id, movement_id, medium_id, year, dimensions, materials, description, price, currency, edition, status, featured, images)
    values (${p.title}, ${p.slug}, ${p.artistId}, ${p.movementId}, ${p.mediumId}, ${p.year}, ${p.dimensions}, ${p.materials}, ${p.description}, ${p.price}, ${p.currency}, ${p.edition}, ${p.status}, ${p.featured}, ${JSON.stringify(p.images)})
  `;

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect("/admin/artworks");
}

export async function updateArtwork(id: string, formData: FormData) {
  const p = buildArtworkPayload(formData);
  await sql`
    update artworks set
      title = ${p.title}, slug = ${p.slug}, artist_id = ${p.artistId}, movement_id = ${p.movementId},
      medium_id = ${p.mediumId}, year = ${p.year}, dimensions = ${p.dimensions}, materials = ${p.materials},
      description = ${p.description}, price = ${p.price}, currency = ${p.currency}, edition = ${p.edition},
      status = ${p.status}, featured = ${p.featured}, images = ${JSON.stringify(p.images)}
    where id = ${id}
  `;

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  redirect("/admin/artworks");
}

export async function deleteArtwork(id: string) {
  await sql`delete from artworks where id = ${id}`;

  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
}
