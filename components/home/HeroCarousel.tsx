"use client";

import Link from "next/link";
import type { Artwork } from "@/types";

export function HeroCarousel({ works }: { works: Artwork[] }) {
  const totalWorks = works.length;

  return (
    <section className="relative isolate min-h-[min(780px,calc(100svh-5rem))] overflow-hidden border-b border-line bg-ink sm:min-h-[min(860px,calc(100svh-5rem))]">
      <div className="flex min-h-[inherit] flex-col items-center justify-center px-6 pb-24 pt-24 text-center sm:px-10">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.34em] text-white/85">
          B-Edge Artworks · Original art &amp; timeless expression
        </p>

        <h1 className="mt-7 max-w-6xl font-display text-[clamp(3.1rem,8.4vw,7.4rem)] font-normal uppercase leading-[0.91] tracking-[-0.045em] text-white">
          Where art lives
          <br />
          beyond time
        </h1>

        <p className="mt-7 max-w-xl font-body text-sm leading-7 text-white/90 sm:text-base">
          Discover original paintings, sculpture and bronze from a considered
          collection of artists and art movements.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/gallery"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white bg-white px-7 py-3 font-body text-xs uppercase tracking-[0.16em] text-[#0B0A08] transition-all duration-300 hover:border-white/80 hover:bg-white/90"
          >
            Explore the collection
          </Link>
          <Link
            href="/artists"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 px-7 py-3 font-body text-xs uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0B0A08]"
          >
            Meet the artists
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-2 sm:bottom-8 sm:left-10">
        <span className="h-px w-8 bg-white" />
        <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-white/75">
          Selected collection · {String(totalWorks).padStart(2, "0")} original works
        </span>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-3 sm:bottom-8 sm:right-10">
        <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-white/70">
          01 / Cinematic
        </span>
        <span className="h-px w-8 bg-white/45" />
      </div>
    </section>
  );
}
