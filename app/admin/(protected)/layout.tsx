import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "./actions";

// Session data depends on cookies — this subtree can't be statically rendered.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-gesso text-ink lg:flex-row">
      <aside className="z-20 w-full shrink-0 bg-ink text-gesso lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[272px] lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-5 pt-5 lg:block lg:px-7 lg:pt-8">
          <Link href="/admin" className="group flex min-h-12 items-center gap-3" aria-label="B-Edge studio dashboard">
            <span className="flex h-10 w-10 items-center justify-center border border-gilt/70 font-display text-xl italic text-gilt">
              B
            </span>
            <span>
              <span className="block font-display text-lg italic leading-tight text-gesso">B-Edge Artworks</span>
              <span className="mt-1 block font-body text-[0.61rem] uppercase tracking-[0.2em] text-ash">
                Studio workspace
              </span>
            </span>
          </Link>
          <p className="max-w-[45%] truncate text-right font-body text-xs text-ash lg:hidden">{admin.email}</p>
        </div>

        <div className="mt-5 px-3 pb-4 lg:mt-10 lg:flex-1 lg:px-4">
          <AdminNav />
        </div>

        <div className="hidden border-t border-white/10 px-7 py-7 lg:block">
          <p className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-ash">Signed in as</p>
          <p className="mt-2 truncate font-body text-sm text-gesso">{admin.email}</p>
          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="font-body text-[0.68rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-gesso">
        <header className="sticky top-0 z-10 flex min-h-[62px] items-center justify-between gap-4 border-b border-ink/10 bg-gesso/95 px-5 backdrop-blur-sm sm:px-8 lg:px-10">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">
            B-Edge <span className="px-2 text-gilt">/</span> Content management
          </p>
          <form action={signOut} className="lg:hidden">
            <button
              type="submit"
              className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/60 underline decoration-ink/20 underline-offset-4 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </header>

        <main className="admin-theme min-h-[calc(100vh-62px)] overflow-x-auto px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
