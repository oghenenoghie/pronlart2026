"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

export async function updateMovement(id: string, formData: FormData) {
  const era = String(formData.get("era") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const blurb = String(formData.get("blurb") ?? "").trim();
  const heroImage = String(formData.get("heroImagePath") ?? "").trim() || null;

  await sql`
    update movements set era = ${era}, summary = ${summary}, blurb = ${blurb}, hero_image = ${heroImage}
    where id = ${id}
  `;

  revalidatePath("/admin/movements");
  revalidatePath("/movements");
  redirect("/admin/movements");
}
