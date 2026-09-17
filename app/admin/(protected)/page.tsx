import Link from "next/link";
import { sql } from "@/lib/db";

export default async function AdminDashboardPage() {
  const rows = (await sql`
    select
      (select count(*) from artworks)::int as artworks,
      (select count(*) from artists)::int as artists,
      (select count(*) from mediums)::int as mediums,
      (select count(*) from movements)::int as movements,
      (select count(*) from enquiries where status = 'open')::int as open_enquiries,
      (select count(*) from sell_submissions where status = 'pending')::int as pending_submissions,
      (select count(*) from contact_messages where status = 'open')::int as open_messages,
      (select count(*) from artworks where status = 'sold')::int as archived
  `) as unknown as {
    artworks: number;
    artists: number;
    mediums: number;
    movements: number;
    open_enquiries: number;
    pending_submissions: number;
    open_messages: number;
    archived: number;
  }[];
  const counts = rows[0];

  const cards = [
    { href: "/admin/artworks", label: "Artworks", count: counts.artworks },
    { href: "/admin/artists", label: "Artists", count: counts.artists },
    { href: "/admin/mediums", label: "Mediums", count: counts.mediums },
    { href: "/admin/movements", label: "Movements", count: counts.movements },
    { href: "/admin/enquiries", label: "Open enquiries", count: counts.open_enquiries },
    { href: "/admin/submissions", label: "Pending submissions", count: counts.pending_submissions },
    { href: "/admin/contact", label: "Contact messages", count: counts.open_messages },
    { href: "/admin/artworks?status=sold", label: "Archive", count: counts.archived },
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
