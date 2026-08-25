import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types";

/**
 * A static echo of the ExhibitionScroll pin/crossfade above it: the lead
 * work of the current exhibition framed by two out-of-focus neighbours,
 * with the rest of the exhibition as a thumbnail strip underneath.
 */
export function ExhibitionSpotlight({ works }: { works: Artwork[] }) {
  const centre = works[0];
  if (!centre) return null;

  const left = works[1] ?? centre;
  const right = works[2] ?? centre;
  const thumbnails = works.slice(0, 7);

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
              <ArtworkImage artwork={centre} className="w-full" priority />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute right-0 hidden h-[68%] w-[26%] translate-x-1/3 opacity-25 blur-[2px] md:block"
            >
              <ArtworkImage artwork={right} className="h-full w-full" />
            </div>

            <LinkButton href={`/artworks/${centre.slug}`} className="absolute bottom-0 z-20 bg-ink">
              More Info
            </LinkButton>
          </div>
        </Reveal>

        {thumbnails.length > 1 && (
          <Reveal>
            <div className="mt-16 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 md:grid-cols-7">
              {thumbnails.map((artwork, i) => (
                <Link
                  key={artwork.id}
                  href={`/artworks/${artwork.slug}`}
                  className={cn("group relative block aspect-[4/3] overflow-hidden", i === 0 && "ring-1 ring-inset ring-gilt")}
                >
                  <ArtworkImage artwork={artwork} className="h-full w-full" />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-ink/70 p-2 text-left font-body text-[0.7rem] uppercase tracking-[0.1em] text-gesso transition-colors group-hover:text-gilt">
                    {artwork.artist.name}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
