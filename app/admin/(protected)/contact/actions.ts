"use server";

import { revalidatePath } from "next/cache";
import { updateContactMessageStatus, type ContactMessageStatus } from "@/lib/data";

export async function setContactMessageStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as ContactMessageStatus;
  await updateContactMessageStatus(id, status);
  revalidatePath("/admin/contact");
}
