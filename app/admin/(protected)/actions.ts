"use server";

import { redirect } from "next/navigation";
import { signOut as signOutSession } from "@/lib/auth/server";

export async function signOut() {
  await signOutSession();
  redirect("/admin/login");
}
