"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Artist } from "@/types";

function buildArtistPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const portrait = String(formData.get("portraitPath") ?? "").trim();

  return {
    name,
    slug: slugInput || slugify(name),
    portrait: portrait || null,
    statement: String(formData.get("statement") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active") as Artist["status"],
  };
}

export async function createArtist(formData: FormData) {
  const p = buildArtistPayload(formData);
  await sql`
    insert into artists (name, slug, portrait, statement, bio, status)
    values (${p.name}, ${p.slug}, ${p.portrait}, ${p.statement}, ${p.bio}, ${p.status})
  `;

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function updateArtist(id: string, formData: FormData) {
  const p = buildArtistPayload(formData);
  await sql`
    update artists set name = ${p.name}, slug = ${p.slug}, portrait = ${p.portrait},
      statement = ${p.statement}, bio = ${p.bio}, status = ${p.status}
    where id = ${id}
  `;

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function deleteArtist(id: string) {
  await sql`delete from artists where id = ${id}`;

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
}
