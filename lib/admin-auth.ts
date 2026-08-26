import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";

export type AdminSession = {
  userId: string;
  email: string | null;
};

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session?.user) redirect("/admin/login");

  if (session.user.role !== "admin") {
    redirect(`/admin/login?error=${encodeURIComponent("That account doesn't have admin access.")}`);
  }

  return { userId: session.user.id, email: session.user.email ?? null };
}
