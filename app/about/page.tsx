import type { Metadata } from "next";
import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Reveal } from "@/components/motion/Reveal";
import { listArtworks } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "About B-Edge Artworks — a curated marketplace for original art.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const artworks = await listArtworks({ sort: "newest" });
  const featured = artworks.find((artwork) => artwork.images.length > 0);

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-10">
        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">Our point of view / B-Edge Artworks</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
            Art first.
            <br />
            <span className="italic">Always.</span>
          </h1>
          <p className="mt-7 max-w-xl font-body text-lg leading-8 text-ink/65">
            B-Edge brings artists and collectors together around original work, creating a considered place to discover paintings, sculpture, bronze and carving.
          </p>
          <div className="mt-9 flex flex-wrap gap-5">
            <Link href="/gallery" className="inline-flex min-h-12 items-center bg-ink px-6 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">Explore the gallery ↗</Link>
            <Link href="/artists" className="inline-flex min-h-12 items-center border-b border-ink/35 px-1 font-body text-label uppercase tracking-[0.16em] text-ink hover:border-gilt">Meet the artists</Link>
          </div>
        </Reveal>
        <Reveal>
          {featured ? (
            <div>
              <div className="border border-ink/10 bg-white p-2">
                <ArtworkImage artwork={featured} className="w-full" priority />
              </div>
              <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-ink/45">{featured.artist.name} <span className="mx-2 text-gilt">/</span> {featured.title}, {featured.year}</p>
            </div>
          ) : (
            <div className="aspect-[5/4] border border-ink/10 bg-white" />
          )}
        </Reveal>
      </section>

      <section className="border-y border-ink/10 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3 md:gap-10">
          {[
            ["01 / Discover", "Find the work", "Browse by artist, material or movement, and move from a first impression to the details that matter."],
            ["02 / Understand", "Read the story", "Each artwork is presented with its artist, title, year, medium, dimensions and availability."],
            ["03 / Connect", "Meet the maker", "Enquire about a work or submit an original piece for consideration by the gallery."],
          ].map(([eyebrow, title, copy]) => (
            <Reveal key={eyebrow}>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">{eyebrow}</p>
              <h2 className="mt-4 font-display text-2xl italic text-ink">{title}</h2>
              <p className="mt-3 font-body text-sm leading-7 text-ink/60">{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 sm:py-20 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-body text-label uppercase tracking-[0.18em] text-ink/45">A collection that keeps its history</p>
          <h2 className="mt-4 max-w-2xl font-display text-display-lg italic text-ink">The story doesn't end when a work leaves the gallery.</h2>
        </div>
        <Link href="/archive" className="inline-flex min-h-11 items-center border-b border-ink/35 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink hover:border-gilt">Visit the archive ↗</Link>
      </section>
    </main>
  );
}
