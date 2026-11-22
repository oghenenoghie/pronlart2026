import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/types";
import type { MovementWithCount } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";

export function MovementsTeaser({
  movements,
  artworks,
}: {
  movements: MovementWithCount[];
  artworks: Artwork[];
}) {
  const visibleMovements = [...movements]
    .filter((movement) => movement.artworkCount > 0)
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 4);

  if (visibleMovements.length === 0) return null;

  return (
    <section className="bg-gesso px-6 py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
                03 / Discover
              </p>
              <h2 className="mt-4 font-display text-display-lg font-medium leading-tight text-ink">
                Explore by movement.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="font-body text-sm leading-7 text-ink/60">
                Follow the ideas, forms and periods that bring each work into focus.
              </p>
              <Link
                href="/movements"
                className="mt-4 inline-flex min-h-11 items-center border-b border-ink/30 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-gilt hover:text-ink/65"
              >
                All movements <span aria-hidden className="ml-3 text-lg">↗</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {visibleMovements.map((movement) => {
            const representative = artworks.find(
              (artwork) => artwork.movement.id === movement.id && artwork.images.length > 0,
            );
            const representativeImage =
              representative?.images.find((image) => image.isPrimary) ?? representative?.images[0];
            const imagePath = movement.heroImage ?? representativeImage?.path;

            return (
              <Reveal key={movement.id}>
                <Link
                  href={"/movements/" + movement.slug}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-white transition-colors group-hover:border-gilt/60">
                    {imagePath ? (
                      <Image
                        src={imagePath}
                        alt={movement.name}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 48vw, 48vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-end p-4">
                        <span className="font-display text-2xl italic text-ink/25">{movement.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg italic text-ink sm:text-xl">{movement.name}</h3>
                    <span className="shrink-0 font-body text-[0.65rem] uppercase tracking-[0.12em] text-ink/50">
                      {movement.artworkCount} {movement.artworkCount === 1 ? "work" : "works"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 font-body text-xs leading-5 text-ink/55">
                    {movement.summary}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
