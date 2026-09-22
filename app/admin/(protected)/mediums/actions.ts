"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/utils";

function buildMediumPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  return { name, slug: slugInput || slugify(name) };
}

export async function createMedium(formData: FormData) {
  const p = buildMediumPayload(formData);
  await sql`insert into mediums (name, slug) values (${p.name}, ${p.slug})`;

  revalidatePath("/admin/mediums");
  redirect("/admin/mediums");
}

export async function updateMedium(id: string, formData: FormData) {
  const p = buildMediumPayload(formData);
  await sql`update mediums set name = ${p.name}, slug = ${p.slug} where id = ${id}`;

  revalidatePath("/admin/mediums");
  redirect("/admin/mediums");
}

export async function deleteMedium(id: string) {
  await sql`delete from mediums where id = ${id}`;

  revalidatePath("/admin/mediums");
}
