import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { ArtistsTeaser } from "@/components/home/ArtistsTeaser";
import { SellCallout } from "@/components/home/SellCallout";
import { MovementsTeaser } from "@/components/common/MovementsTeaser";
import { listArtworks, listMovementsWithCounts, getSellCalloutImage } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [artworks, movements, configuredSellImage] = await Promise.all([
    listArtworks({ sort: "newest" }),
    listMovementsWithCounts(),
    getSellCalloutImage(),
  ]);

  const heroWork =
    artworks.find((work) => work.featured && work.status === "available") ??
    artworks.find((work) => work.featured) ??
    artworks.find((work) => work.status === "available") ??
    artworks[0];

  const selectedWorks = artworks.filter((work) => work.id !== heroWork?.id).slice(0, 3);
  const populatedMovements = movements.filter((movement) => movement.artworkCount > 0);

  const artistMap = new Map<
    string,
    { artist: (typeof artworks)[number]["artist"]; artworkCount: number; artwork: (typeof artworks)[number] }
  >();

  for (const artwork of artworks) {
    const current = artistMap.get(artwork.artist.id);
    if (current) {
      current.artworkCount += 1;
    } else {
      artistMap.set(artwork.artist.id, {
        artist: artwork.artist,
        artworkCount: 1,
        artwork,
      });
    }
  }

  const artists = Array.from(artistMap.values())
    .sort((a, b) => b.artworkCount - a.artworkCount)
    .slice(0, 3);

  const fallbackArtworkImage =
    heroWork?.images.find((image) => image.isPrimary) ?? heroWork?.images[0];

  const sellImage =
    configuredSellImage ??
    (fallbackArtworkImage
      ? {
          path: fallbackArtworkImage.path,
          alt: fallbackArtworkImage.alt,
          width: fallbackArtworkImage.width,
          height: fallbackArtworkImage.height,
        }
      : undefined);

  return (
    <main className="bg-gesso text-ink">
      <HeroSection work={heroWork} />
      <SelectedWorks works={selectedWorks} />
      <MovementsTeaser movements={populatedMovements} artworks={artworks} />
      <ArtistsTeaser artists={artists} />
      <SellCallout image={sellImage} />

      <section className="border-t border-ink/10 bg-gesso px-6 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
              The collection continues
            </p>
            <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
              Every work has a story.
            </h2>
            <p className="mt-4 max-w-xl font-body text-base leading-7 text-ink/65">
              Revisit sold and past works in the archive, with their details preserved alongside
              the artists and movements that shaped them.
            </p>
          </div>
          <Link
            href="/archive"
            className="inline-flex min-h-12 items-center border-b border-ink/40 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-gilt hover:text-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4 focus-visible:ring-offset-gesso"
          >
            Explore the archive <span aria-hidden className="ml-3 text-lg">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
