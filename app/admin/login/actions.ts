"use server";

import { redirect } from "next/navigation";
import { signInWithEmail } from "@/lib/auth/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await signInWithEmail(email, password);

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error)}`);
  }

  redirect("/admin");
}
