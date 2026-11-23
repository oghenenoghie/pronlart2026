"use client";

import Link from "next/link";
import type { Artwork } from "@/types";

export function HeroCarousel({ works: _works }: { works: Artwork[] }) {
  return (
    <section className="relative isolate min-h-[min(780px,calc(100svh-5rem))] overflow-hidden border-b border-line bg-[#100d09] sm:min-h-[min(860px,calc(100svh-5rem))]">
      <div
        className="absolute inset-0 -z-20 scale-[1.02] bg-cover bg-center"
        role="img"
        aria-label="Grand classical sculpture gallery"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/a/a1/Metropolitan_Museum%2C_hall.jpg')",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,10,7,.72),rgba(13,10,7,.34)_48%,rgba(13,10,7,.68)),linear-gradient(0deg,rgba(10,8,6,.62),transparent_34%,rgba(10,8,6,.36))]"
      />
      <div className="flex min-h-[inherit] flex-col items-center justify-center px-6 pb-20 pt-24 text-center sm:px-10">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.34em] text-gesso/80">
          B-Edge Artworks · Original art & timeless expression
        </p>
        <h1 className="mt-7 max-w-5xl font-display text-[clamp(3.1rem,8.4vw,7.4rem)] font-normal uppercase leading-[0.91] tracking-[-0.045em] text-[#fbf8f1] drop-shadow-[0_3px_24px_rgba(0,0,0,.3)]">
          Where art lives
          <br />
          beyond time
        </h1>
        <p className="mt-7 max-w-xl font-body text-sm leading-7 text-white/90 sm:text-base">
          Discover original paintings, sculpture and bronze from a considered
          collection of artists and art movements.
        </p>
        <Link
          href="/gallery"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 px-7 py-3 font-body text-sm text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#17130f]"
        >
          Explore the collection
        </Link>
      </div>
      <div className="absolute bottom-6 left-6 flex items-center gap-2 sm:bottom-8 sm:left-10">
        <span className="h-px w-8 bg-gilt" />
        <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-white/70">
          Original works · Selected collection
        </span>
      </div>
    </section>
  );
}
