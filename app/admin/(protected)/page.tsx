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
    { href: "/admin/artworks", label: "Artworks in catalogue", count: counts.artworks, group: "Catalogue" },
    { href: "/admin/artists", label: "Artists", count: counts.artists, group: "Catalogue" },
    { href: "/admin/mediums", label: "Mediums", count: counts.mediums, group: "Catalogue" },
    { href: "/admin/movements", label: "Movements", count: counts.movements, group: "Catalogue" },
    { href: "/admin/enquiries", label: "Open enquiries", count: counts.open_enquiries, group: "Inbox" },
    { href: "/admin/submissions", label: "Pending submissions", count: counts.pending_submissions, group: "Inbox" },
    { href: "/admin/contact", label: "Open messages", count: counts.open_messages, group: "Inbox" },
    { href: "/admin/artworks?status=sold", label: "Works in archive", count: counts.archived, group: "Catalogue" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="font-body text-[0.66rem] uppercase tracking-[0.2em] text-ink/50">Studio overview</p>
          <h1 className="mt-3 font-display text-4xl italic tracking-tight text-ink sm:text-5xl">
            The workspace.
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm leading-7 text-ink/60">
            A clear view of the collection, the artists behind it, and the conversations coming into the gallery.
          </p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="inline-flex min-h-11 w-fit items-center justify-center border border-ink bg-ink px-5 py-3 font-body text-[0.68rem] uppercase tracking-[0.17em] text-white transition-colors hover:border-gilt hover:bg-gilt hover:text-ink"
        >
          Add an artwork <span aria-hidden className="ml-3 text-gilt">↗</span>
        </Link>
      </div>

      <section aria-labelledby="catalogue-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="catalogue-heading" className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink/60">
            Collection & activity
          </h2>
          <span className="font-body text-xs text-ink/40">Live totals</span>
        </div>
        <div className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group min-h-[142px] bg-white p-4 transition-colors hover:bg-[#faf9f6] sm:p-6"
            >
              <span className="font-body text-[0.6rem] uppercase tracking-[0.16em] text-ink/40">{card.group}</span>
              <span className="mt-5 block font-display text-4xl italic tabular-nums leading-none text-ink sm:text-5xl">
                {card.count}
              </span>
              <span className="mt-3 flex items-center justify-between gap-2 font-body text-xs text-ink/60">
                {card.label}
                <span aria-hidden className="text-gilt opacity-0 transition-opacity group-hover:opacity-100">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-ink/10 bg-white p-6 sm:p-8">
          <p className="font-body text-[0.63rem] uppercase tracking-[0.18em] text-ink/45">Catalogue</p>
          <h2 className="mt-3 font-display text-2xl italic text-ink">Keep the collection current.</h2>
          <p className="mt-2 max-w-md font-body text-sm leading-6 text-ink/60">
            Add new works, refine artist profiles, and keep the movement and medium taxonomy accurate.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/admin/artworks/new" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">New artwork</Link>
            <Link href="/admin/artists/new" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">New artist</Link>
            <Link href="/admin/movements" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">Edit movements</Link>
          </div>
        </div>
        <div className="border border-ink/10 bg-white p-6 sm:p-8">
          <p className="font-body text-[0.63rem] uppercase tracking-[0.18em] text-ink/45">Inbox</p>
          <h2 className="mt-3 font-display text-2xl italic text-ink">Stay close to collectors.</h2>
          <p className="mt-2 max-w-md font-body text-sm leading-6 text-ink/60">
            Review purchase enquiries, submissions from artists, and messages sent through the contact page.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/admin/enquiries" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">View enquiries</Link>
            <Link href="/admin/submissions" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">Review submissions</Link>
            <Link href="/admin/contact" className="font-body text-xs uppercase tracking-[0.12em] text-ink underline decoration-gilt underline-offset-4">Contact messages</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
