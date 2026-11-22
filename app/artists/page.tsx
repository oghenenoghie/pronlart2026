import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/common/PageIntro";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { listArtistsWithCounts, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the artists and makers represented in the B-Edge collection.",
};

export default async function ArtistsPage() {
  const [artists, artworks] = await Promise.all([listArtistsWithCounts(), listArtworks()]);
  const artistWorks = new Map<string, (typeof artworks)[number]>();
  for (const artwork of artworks) {
    if (!artistWorks.has(artwork.artist.id)) artistWorks.set(artwork.artist.id, artwork);
  }

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="The people behind the work"
          title="Meet the artists."
          description="Discover the makers, practices and ideas represented in the B-Edge collection. Each profile brings the work back to the person who made it."
          aside={<Link href="/sell" className="inline-flex min-h-11 items-center border-b border-ink/35 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink hover:border-gilt">Become a represented artist ↗</Link>}
        />

        {artists.length === 0 ? (
          <div className="mt-12 border-t border-ink/15 py-16">
            <h2 className="font-display text-3xl italic text-ink">Artist profiles are on their way.</h2>
            <p className="mt-3 max-w-lg font-body leading-7 text-ink/60">The collection will introduce its artists here as profiles and works are added.</p>
          </div>
        ) : (
          <StaggerGroup as="ul" className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist, index) => {
              const artwork = artistWorks.get(artist.id);
              const primary = artwork?.images.find((image) => image.isPrimary) ?? artwork?.images[0];
              const imagePath = artist.portrait ?? primary?.path;

              return (
                <StaggerItem as="li" key={artist.slug}>
                  <Link href={"/artists/" + artist.slug} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4">
                    <div className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-white">
                      {imagePath ? (
                        <Image
                          src={imagePath}
                          alt={artist.portrait ? artist.name : (artwork?.title ?? "Artwork") + " by " + artist.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-end p-6">
                          <span className="font-display text-4xl italic text-ink/25">{artist.name}</span>
                        </div>
                      )}
                      <span className="absolute left-4 top-4 bg-gesso/90 px-3 py-2 font-body text-[0.62rem] uppercase tracking-[0.16em] text-ink/60">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                      <h2 className="font-display text-2xl italic text-ink transition-colors group-hover:text-ink/60">{artist.name}</h2>
                      <span className="shrink-0 font-body text-xs text-ink/45">{artist.artworkCount} {artist.artworkCount === 1 ? "work" : "works"}</span>
                    </div>
                    {artist.statement && <p className="mt-3 line-clamp-2 font-body text-sm leading-6 text-ink/60">{artist.statement}</p>}
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </div>
    </main>
  );
}
