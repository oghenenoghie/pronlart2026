"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type MovementUpdate = Database["public"]["Tables"]["movements"]["Update"];

export async function updateMovement(id: string, formData: FormData) {
  const heroImagePath = String(formData.get("heroImagePath") ?? "").trim();

  const payload: MovementUpdate = {
    era: String(formData.get("era") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    blurb: String(formData.get("blurb") ?? "").trim(),
    hero_image: heroImagePath || null,
  };

  const supabase = createClient();
  const { error } = await supabase.from("movements").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/movements");
  revalidatePath("/movements");
  redirect("/admin/movements");
}
