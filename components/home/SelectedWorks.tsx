import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Reveal } from "@/components/motion/Reveal";
import { formatPrice } from "@/lib/money";
import type { Artwork } from "@/types";

export function SelectedWorks({ works }: { works: Artwork[] }) {
  if (works.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
                02 / Selected works
              </p>
              <h2 className="mt-4 font-display text-display-lg font-medium leading-tight text-ink">
                A closer look.
              </h2>
            </div>
            <p className="max-w-md font-body text-sm leading-7 text-ink/60">
              A selection of original works from the B-Edge collection. Open a work to explore
              its story, materials and details.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => {
            const availability =
              work.status === "sold"
                ? "In the archive"
                : work.status === "reserved"
                  ? "Reserved"
                  : formatPrice(work.price, work.currency);

            return (
              <Reveal key={work.id}>
                <Link
                  href={"/artworks/" + work.slug}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4"
                  aria-label={"View " + work.title + " by " + work.artist.name}
                >
                  <div className="overflow-hidden border border-ink/10 transition-colors duration-300 group-hover:border-gilt/60">
                    <ArtworkImage artwork={work} className="w-full" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-body text-label uppercase tracking-[0.16em] text-ink/50">
                        {work.artist.name}
                      </p>
                      <h3 className="mt-2 font-display text-xl italic text-ink transition-colors group-hover:text-ink/65">
                        {work.title}, {work.year}
                      </h3>
                      <p className="mt-2 font-body text-sm text-ink/60">
                        {work.materials || work.medium.name}
                      </p>
                      <p className="mt-1 font-body text-sm text-ink/50">{work.dimensions}</p>
                    </div>
                    <span className="shrink-0 pt-1 font-body text-xs tabular-nums text-ink/65">
                      {availability}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-14 flex justify-center">
            <Link
              href="/gallery"
              className="inline-flex min-h-12 items-center border border-ink/25 px-7 py-3 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-gesso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2"
            >
              View all artworks <span aria-hidden className="ml-4 text-lg">↗</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
