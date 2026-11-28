import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import type { Artwork, Movement } from "@/types";

/**
 * A clean single-work exhibition presentation with simple movement navigation.
 */
export function ExhibitionSpotlight({
  featured,
  movements,
}: {
  featured: Artwork[];
  movements: Movement[];
}) {
  const centre = featured[0];
  if (!centre) return null;

  return (
    <section className="border-t border-line bg-ink px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">◆ Exhibitions</p>
          <h2 className="mt-3 font-display text-display-lg font-bold text-gesso">Current Exhibition</h2>
        </Reveal>

        <Reveal>
          <div className="relative mt-16 flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-2xl">
              <ArtworkImage artwork={centre} className="w-full" />
            </div>

            <Link
              href={`/artworks/${centre.slug}`}
              className="border border-gilt bg-ink px-8 py-3 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
            >
              More Info
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 md:grid-cols-7">
            {movements.map((movement, i) => (
              <Link
                key={movement.slug}
                href={`/movements/${movement.slug}`}
                className="flex aspect-[4/3] flex-col justify-end bg-ink"
              >
                <span
                  className={cn(
                    "p-3 text-left font-body text-[0.7rem] uppercase leading-tight tracking-[0.12em] text-gesso",
                  )}
                >
                  {movement.name}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
