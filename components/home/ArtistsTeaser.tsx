import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { Artist, Artwork } from "@/types";

type ArtistFeature = {
  artist: Artist;
  artworkCount: number;
  artwork: Artwork;
};

export function ArtistsTeaser({ artists }: { artists: ArtistFeature[] }) {
  if (artists.length === 0) return null;

  return (
    <section className="bg-white px-6 pb-20 text-ink sm:pb-28">
      <div className="mx-auto max-w-7xl border-t border-ink/10 pt-20 sm:pt-24">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
                04 / The people behind the work
              </p>
              <h2 className="mt-4 font-display text-display-lg font-medium leading-tight text-ink">
                Meet the artists.
              </h2>
            </div>
            <Link
              href="/artists"
              className="inline-flex min-h-11 items-center border-b border-ink/30 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-gilt hover:text-ink/65"
            >
              All artists <span aria-hidden className="ml-3 text-lg">↗</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map(({ artist, artworkCount, artwork }) => {
            const primary = artwork.images.find((image) => image.isPrimary) ?? artwork.images[0];
            const imagePath = artist.portrait ?? primary?.path;

            return (
              <Reveal key={artist.id}>
                <Link
                  href={"/artists/" + artist.slug}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-gesso transition-colors group-hover:border-gilt/60">
                    {imagePath ? (
                      <Image
                        src={imagePath}
                        alt={artist.portrait ? artist.name : artwork.title + " by " + artist.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-end p-6">
                        <span className="font-display text-4xl italic text-ink/25">
                          {artist.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl italic text-ink">{artist.name}</h3>
                    <span className="font-body text-xs uppercase tracking-[0.12em] text-ink/50">
                      {artworkCount} {artworkCount === 1 ? "work" : "works"}
                    </span>
                  </div>
                  {artist.statement && (
                    <p className="mt-2 line-clamp-2 max-w-lg font-body text-sm leading-6 text-ink/60">
                      {artist.statement}
                    </p>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
