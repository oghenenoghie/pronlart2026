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
    <section className="relative isolate min-h-[760px] overflow-hidden bg-transparent text-[#f7f3eb] sm:min-h-[820px] lg:min-h-[min(900px,calc(100svh-5rem))]">
      {hasSlides ? (
        <div className="absolute inset-0 z-[1]">
          <HeroSlides works={works} />
        </div>
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.78)_34%,rgba(10,10,10,0.25)_72%,rgba(10,10,10,0.16)_100%),linear-gradient(0deg,rgba(8,8,8,0.76)_0%,transparent_34%,rgba(8,8,8,0.12)_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1600px] flex-col justify-center px-6 pb-36 pt-28 sm:min-h-[820px] sm:px-10 lg:min-h-[min(900px,calc(100svh-5rem))] lg:px-16">
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-body text-[0.68rem] uppercase tracking-[0.28em] text-[#d4b77e] sm:text-xs">
              B-Edge Art Collections <span className="mx-3 text-white/40">/</span> Original works
            </p>
            <h1 className="mt-8 max-w-4xl font-display text-[clamp(4rem,9vw,8.8rem)] font-medium leading-[0.86] tracking-[-0.055em] text-[#fbf8f1]">
              Where art lives
              <br />
              <span className="font-normal italic text-[#d8c4a0]">beyond time.</span>
            </h1>
            <p className="mt-8 max-w-xl font-body text-base leading-8 text-white/75 sm:text-lg">
              Discover original paintings, sculpture and bronze from a considered collection
              of artists and art movements.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/gallery"
                className="inline-flex min-h-14 items-center justify-center bg-[#d2b47b] px-8 py-4 font-body text-[0.68rem] uppercase tracking-[0.18em] text-[#171512] transition-colors hover:bg-[#f0dfbd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]"
              >
                Explore the collection <span aria-hidden className="ml-5 text-lg">↗</span>
              </Link>
              <Link
                href="/artists"
                className="inline-flex min-h-14 items-center border-b border-white/55 px-1 py-3 font-body text-[0.68rem] uppercase tracking-[0.18em] text-white transition-colors hover:border-[#d2b47b] hover:text-[#d2b47b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Meet the artists
              </Link>
            </div>
          </div>
        </Reveal>

        {figures.length > 0 && (
          <dl className="absolute bottom-8 left-6 grid max-w-[32rem] grid-cols-3 gap-6 border-t border-white/25 pt-4 sm:bottom-10 sm:left-10 sm:gap-12 lg:left-16">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col-reverse">
                <dt className="mt-1 font-body text-[0.58rem] uppercase leading-5 tracking-[0.16em] text-white/55 sm:text-[0.65rem]">
                  {figure.label}
                </dt>
                <dd className="font-display text-2xl italic text-[#e3c99a] sm:text-3xl">
                  <CountUp value={figure.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="absolute bottom-10 right-6 hidden items-center gap-5 font-body text-[0.62rem] uppercase tracking-[0.2em] text-white/60 md:flex lg:right-16">
          <span>Paintings</span><span className="text-[#d2b47b]">•</span>
          <span>Sculpture</span><span className="text-[#d2b47b]">•</span>
          <span>Bronze</span>
        </div>
      </div>
    </section>
  );
}
