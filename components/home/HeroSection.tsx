import Link from "next/link";
import { HeroSlides } from "@/components/home/HeroSlides";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import type { Artwork } from "@/types";

export type HeroStats = {
  works: number;
  artists: number;
  movements: number;
};

export function HeroSection({ works, stats }: { works: Artwork[]; stats: HeroStats }) {
  const figures = [
    { value: stats.works, label: "Original works" },
    { value: stats.artists, label: "Artists" },
    { value: stats.movements, label: "Art movements" },
  ].filter((figure) => figure.value > 0);
  const hasSlides = works.some((work) => work.images.length > 0);

  return (
    <section className="bg-gesso text-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:py-20 md:min-h-[700px] md:grid-cols-[0.88fr_1.12fr] md:gap-16 md:px-10 lg:py-24">
        <Reveal>
          <div className="max-w-xl">
            <p className="font-body text-label uppercase tracking-[0.2em] text-ink/55">
              B-Edge Art Collections <span className="mx-2 text-gilt">/</span> Original works
            </p>
            <h1 className="mt-7 font-display text-[clamp(3.5rem,6.2vw,6.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink">
              Art that
              <br />
              <span className="italic">stays with you.</span>
            </h1>
            <p className="mt-7 max-w-lg font-body text-base leading-8 text-ink/65 sm:text-lg">
              Discover original paintings, sculpture and bronze from a considered collection
              of artists and art movements.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/gallery"
                className="inline-flex min-h-12 items-center justify-center bg-ink px-7 py-3 font-body text-label uppercase tracking-[0.16em] text-gesso transition-colors hover:bg-gilt hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-gesso"
              >
                Explore the collection <span aria-hidden className="ml-4 text-lg">↗</span>
              </Link>
              <Link
                href="/artists"
                className="inline-flex min-h-12 items-center border-b border-ink/35 px-1 py-3 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-gilt hover:text-ink/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-gesso"
              >
                Meet the artists
              </Link>
            </div>

            {figures.length > 0 && (
              <dl className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/15 pt-5">
                {figures.map((figure) => (
                  <div key={figure.label} className="flex flex-col-reverse">
                    <dt className="mt-1 font-body text-[0.65rem] uppercase leading-5 tracking-[0.12em] text-ink/55">
                      {figure.label}
                    </dt>
                    <dd className="font-display text-2xl italic text-ink">
                      <CountUp value={figure.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Reveal>

        <Reveal>
          {hasSlides ? (
            <HeroSlides works={works} />
          ) : (
            <div className="flex min-h-[420px] items-end border border-ink/15 bg-white p-8 sm:min-h-[560px]">
              <div>
                <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
                  B-Edge Art Collections
                </p>
                <p className="mt-4 font-display text-3xl italic text-ink">
                  A place for original work.
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 font-body text-[0.68rem] uppercase tracking-[0.16em] text-ink/50 md:px-10">
          <span>Paintings</span>
          <span aria-hidden className="hidden text-gilt sm:inline">•</span>
          <span>Sculpture</span>
          <span aria-hidden className="hidden text-gilt sm:inline">•</span>
          <span>Bronze</span>
          <span aria-hidden className="hidden text-gilt sm:inline">•</span>
          <span>Discover by movement</span>
        </div>
      </div>
    </section>
  );
}
