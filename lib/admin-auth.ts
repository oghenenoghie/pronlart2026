import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string | null;
};

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (profile?.role !== "admin") {
    redirect(`/admin/login?error=${encodeURIComponent("That account doesn't have admin access.")}`);
  }

  return { userId: user.id, email: user.email ?? null };
}
