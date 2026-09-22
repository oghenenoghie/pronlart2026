"use server";

import { revalidatePath } from "next/cache";
import { setSellCalloutImage } from "@/lib/data";

export async function updateSellCalloutImage(formData: FormData) {
  const path = String(formData.get("sellImagePath") ?? "").trim();
  if (!path) return;

  const alt = String(formData.get("sellImageAlt") ?? "").trim() || "How Do I Get My Work Shown?";
  const width = Number(formData.get("sellImagePathWidth") ?? 0) || 1200;
  const height = Number(formData.get("sellImagePathHeight") ?? 0) || 1500;

  await setSellCalloutImage({ path, alt, width, height });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
