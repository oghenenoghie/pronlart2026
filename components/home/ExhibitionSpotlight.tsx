import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { cn } from "@/lib/utils";
import type { Artwork, Movement } from "@/types";

function movementHue(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

/**
 * The current exhibition, framed by two out-of-focus works either side —
 * a static echo of the ExhibitionScroll pin/crossfade, with a strip of
 * movements underneath standing in for "what else is showing."
 */
export function ExhibitionSpotlight({
  featured,
  movements,
}: {
  featured: Artwork[];
  movements: Movement[];
}) {
  const centre = featured[0];
  const left = featured[1] ?? centre;
  const right = featured[2] ?? centre;

  if (!centre) return null;

  return (
    <section className="border-t border-line bg-ink px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">◆ Exhibitions</p>
          <h2 className="mt-3 font-display text-display-lg font-bold text-gesso">Current Exhibition</h2>
        </Reveal>

        <Reveal>
          <div className="relative mt-16 flex items-center justify-center pb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 hidden h-[68%] w-[26%] -translate-x-1/3 opacity-25 blur-[2px] md:block"
            >
              <ArtworkImage artwork={left} className="h-full w-full" />
            </div>

            <div className="relative z-10 w-full max-w-2xl border border-line bg-ink">
              <ArtworkImage artwork={centre} className="w-full" />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute right-0 hidden h-[68%] w-[26%] translate-x-1/3 opacity-25 blur-[2px] md:block"
            >
              <ArtworkImage artwork={right} className="h-full w-full" />
            </div>

            <Link
              href={`/artworks/${centre.slug}`}
              className="absolute bottom-0 z-20 border border-gilt bg-ink px-8 py-3 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
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
                className={cn(
                  "group relative flex aspect-[4/3] flex-col justify-end overflow-hidden",
                  i === 0 ? "bg-gesso" : "bg-ink",
                )}
              >
                {i !== 0 && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-70 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(155deg, hsl(${movementHue(movement.id)} 22% 14%), hsl(${movementHue(movement.id)} 14% 7%))`,
                    }}
                  />
                )}
                <span
                  className={cn(
                    "relative p-3 text-left font-body text-[0.7rem] uppercase leading-tight tracking-[0.12em]",
                    i === 0 ? "text-ink/70" : "text-gesso",
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
