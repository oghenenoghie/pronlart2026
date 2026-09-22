"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus, type EnquiryStatus } from "@/lib/data";

export async function setEnquiryStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as EnquiryStatus;
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
}
