"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/data";
import type { Database } from "@/types/supabase";

export async function setEnquiryStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as Database["public"]["Enums"]["enquiry_status"];
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
}
