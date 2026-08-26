import { requireAdmin } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "./actions";

// Session data depends on cookies — this subtree can't be statically rendered.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-ink text-gesso">
      <aside className="w-56 shrink-0 border-r border-line px-6 py-8">
        <p className="font-display text-lg italic text-gesso">Pronlart admin</p>
        <p className="mt-1 truncate font-body text-xs text-ash">{admin.email}</p>

        <AdminNav />

        <form action={signOut} className="mt-8 border-t border-line pt-6">
          <button
            type="submit"
            className="font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
          >
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-x-auto px-10 py-8">{children}</main>
    </div>
  );
}
