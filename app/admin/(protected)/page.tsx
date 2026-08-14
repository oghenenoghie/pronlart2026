import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [artworks, artists, mediums, movements, openEnquiries, pendingSubmissions] = await Promise.all([
    supabase.from("artworks").select("*", { count: "exact", head: true }),
    supabase.from("artists").select("*", { count: "exact", head: true }),
    supabase.from("mediums").select("*", { count: "exact", head: true }),
    supabase.from("movements").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("sell_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const cards = [
    { href: "/admin/artworks", label: "Artworks", count: artworks.count ?? 0 },
    { href: "/admin/artists", label: "Artists", count: artists.count ?? 0 },
    { href: "/admin/mediums", label: "Mediums", count: mediums.count ?? 0 },
    { href: "/admin/movements", label: "Movements", count: movements.count ?? 0 },
    { href: "/admin/enquiries", label: "Open enquiries", count: openEnquiries.count ?? 0 },
    { href: "/admin/submissions", label: "Pending submissions", count: pendingSubmissions.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="border border-line p-6 transition-colors hover:border-gilt/50">
            <p className="font-display text-3xl italic tabular-nums text-gesso">{card.count}</p>
            <p className="mt-2 font-body text-label uppercase tracking-[0.18em] text-ash">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
