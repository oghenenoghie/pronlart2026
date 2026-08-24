"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type MediumInsert = Database["public"]["Tables"]["mediums"]["Insert"];

function buildMediumPayload(formData: FormData): MediumInsert {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return { name, slug: slugInput || slugify(name) };
}

export async function createMedium(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("mediums").insert(buildMediumPayload(formData));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mediums");
  redirect("/admin/mediums");
}

export async function updateMedium(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("mediums").update(buildMediumPayload(formData)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mediums");
  redirect("/admin/mediums");
}

export async function deleteMedium(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("mediums").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mediums");
}
