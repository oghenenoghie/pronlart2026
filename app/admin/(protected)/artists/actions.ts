"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type ArtistInsert = Database["public"]["Tables"]["artists"]["Insert"];

function buildArtistPayload(formData: FormData): ArtistInsert {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const portrait = String(formData.get("portraitPath") ?? "").trim();

  return {
    name,
    slug: slugInput || slugify(name),
    portrait: portrait || null,
    statement: String(formData.get("statement") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active") as Database["public"]["Enums"]["artist_status"],
  };
}

export async function createArtist(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("artists").insert(buildArtistPayload(formData));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function updateArtist(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("artists").update(buildArtistPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  redirect("/admin/artists");
}

export async function deleteArtist(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/artists");
  revalidatePath("/artists");
}
