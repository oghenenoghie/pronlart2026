"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import type { Artwork } from "@/types";

export function HeroCarousel({ works }: { works: Artwork[] }) {
  const featured = works[0];

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-[#100f0d]">
      <div className="grid min-h-[min(820px,calc(100svh-5rem))] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-10 sm:py-24 lg:px-14 xl:px-20">
          <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-gilt">
            B-Edge Artworks · Original art &amp; timeless expression
          </p>

          <h1 className="mt-7 max-w-2xl font-display text-[clamp(3.6rem,7.2vw,6.9rem)] font-normal leading-[0.91] tracking-[-0.055em] text-gesso">
            Art that
            <br />
            stays with you.
          </h1>

          <p className="mt-7 max-w-lg font-body text-sm leading-7 text-ash sm:text-base sm:leading-8">
            Discover original paintings, sculpture and bronze from a considered
            collection of artists and art movements.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/gallery"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-gilt bg-gilt px-7 py-3 font-body text-xs uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-gesso hover:bg-gesso"
            >
              Explore the collection
            </Link>
            <Link
              href="/artists"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-7 py-3 font-body text-xs uppercase tracking-[0.16em] text-gesso transition-colors duration-300 hover:border-gilt hover:text-gilt"
            >
              Meet the artists
            </Link>
          </div>

          <div className="mt-14 grid max-w-md grid-cols-3 gap-5 border-t border-line pt-6">
            <div>
              <p className="font-display text-3xl text-gesso">09</p>
              <p className="mt-2 font-body text-[0.57rem] uppercase tracking-[0.16em] text-ash">
                Original works
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-gesso">02</p>
              <p className="mt-2 font-body text-[0.57rem] uppercase tracking-[0.16em] text-ash">
                Featured artists
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-gesso">13</p>
              <p className="mt-2 font-body text-[0.57rem] uppercase tracking-[0.16em] text-ash">
                Art movements
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden border-t border-line bg-[#171512] lg:min-h-0 lg:border-l lg:border-t-0">
          {featured ? (
            <>
              <div className="absolute inset-0 p-5 sm:p-8 lg:p-10">
                <ArtworkImage
                  artwork={featured}
                  className="h-full w-full border border-white/10"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#100f0d]/90 via-transparent to-[#100f0d]/10"
              />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-5 sm:bottom-10 sm:left-10 sm:right-10">
                <div className="min-w-0">
                  <p className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-gilt">
                    Featured work · {featured.year}
                  </p>
                  <h2 className="mt-2 truncate font-display text-2xl italic text-gesso sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-1 font-body text-xs text-white/70">
                    {featured.artist.name}
                  </p>
                </div>
                <Link
                  href={`/artworks/${featured.slug}`}
                  aria-label={`View ${featured.title}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/60 text-xl text-white transition-colors hover:border-gilt hover:bg-gilt hover:text-ink"
                >
                  ↗
                </Link>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center">
              <p className="font-display text-3xl italic text-gesso">
                A considered collection of original art.
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute right-7 top-7 font-body text-[0.58rem] uppercase tracking-[0.2em] text-white/70 sm:right-10 sm:top-10">
            B-Edge · Selected collection
          </div>
        </div>
      </div>
    </section>
  );
}
