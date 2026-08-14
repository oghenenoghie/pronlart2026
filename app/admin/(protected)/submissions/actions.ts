"use server";

import { revalidatePath } from "next/cache";
import { updateSellSubmissionStatus } from "@/lib/data";
import type { Database } from "@/types/supabase";

export async function setSellSubmissionStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as Database["public"]["Enums"]["sell_submission_status"];
  await updateSellSubmissionStatus(id, status);
  revalidatePath("/admin/submissions");
}
