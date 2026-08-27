"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { Artwork } from "@/types";

const INTERVAL = 7000;

const wordVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: "easeIn" as const } },
};

const captionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const eyebrowVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/**
 * Cinematic multi-slide hero: crossfading, slow-Ken-Burns artwork
 * backgrounds behind a word-by-word museum-label reveal — the featured
 * catalogue standing in for the site's own signature exhibition moment.
 */
export function HeroSection({ works }: { works: Artwork[] }) {
  const reduce = useReducedMotion();
  const slides = works.slice(0, 6).filter((w) => w.images.length > 0);

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(slides.length, 1));
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || reduce) return;
    const step = 100 / (INTERVAL / 50);
    const ticker = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => clearInterval(ticker);
  }, [next, slides.length, reduce]);

  if (slides.length === 0) {
    return <StaticHero />;
  }

  const artwork = slides[current];
  const primary = artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];

  return (
    <section className="relative flex h-screen min-h-[640px] flex-col items-center justify-center overflow-hidden border-b border-line">
      {/* Background crossfade + Ken Burns */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${artwork.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: INTERVAL / 1000 + 1.5, ease: "linear" }}
          >
            <Image
              src={primary.path}
              alt={primary.alt}
              fill
              sizes="100vw"
              priority={current === 0}
              quality={85}
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-ink/75" />
        </motion.div>
      </AnimatePresence>

      {/* Slide content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`ey-${artwork.id}`}
            variants={eyebrowVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="font-body text-label uppercase text-gilt"
          >
            {artwork.artist.name}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <h1
            key={`hl-${artwork.id}`}
            className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-display text-display-xl italic text-gesso"
          >
            {artwork.title.split(" ").map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </AnimatePresence>

        <motion.div
          key={`rule-${artwork.id}`}
          className="mx-auto mt-8 h-px w-16 bg-gilt"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        <AnimatePresence mode="wait">
          <motion.p
            key={`cap-${artwork.id}`}
            variants={captionVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="mx-auto mt-6 max-w-md font-body text-sm text-ash"
          >
            {artwork.movement.name} · {artwork.medium.name} · {artwork.year}
          </motion.p>
        </AnimatePresence>

        <motion.div
          key={`cta-${artwork.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.6 } }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <LinkButton href={`/artworks/${artwork.slug}`}>View this work</LinkButton>
          <LinkButton href="/gallery" variant="ghost">
            Enter the gallery
          </LinkButton>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <>
          {/* Slide indicators */}
          <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrent(i);
                  setProgress(0);
                }}
                aria-label={`Go to slide ${i + 1}`}
                className="flex items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    i === current ? "h-1 w-8 bg-gilt" : "h-1.5 w-1.5 bg-gesso/30 hover:bg-gesso/60"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Auto-advance progress bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-line">
            <motion.div className="h-full origin-left bg-gilt" style={{ scaleX: progress / 100 }} />
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-20 right-6 z-10 font-body text-xs text-ash sm:right-16">
            <span className="text-gilt">{String(current + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </>
      )}

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-6 z-10 flex flex-col items-center gap-3 sm:left-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-ash [writing-mode:vertical-lr]">
          Scroll
        </span>
        <motion.div
          className="h-12 w-px bg-gradient-to-b from-gilt/60 to-transparent"
          animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/** Fallback for an empty catalogue — no images to build a slide carousel from. */
function StaticHero() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">Pronlart</p>
      <h1 className="mt-4 font-display text-display-lg italic text-gesso">A gallery, built to be walked.</h1>
      <p className="mt-6 font-body text-lede text-ash">
        Original paintings, sculpture and bronze — browse by movement, buy or enquire, and explore the archive.
      </p>
      <div className="mx-auto mt-10 h-px w-24 bg-gilt/40" />
      <div className="mt-10 flex items-center justify-center gap-6">
        <LinkButton href="/gallery">Enter the gallery</LinkButton>
        <LinkButton href="/movements" variant="ghost">
          Explore movements
        </LinkButton>
      </div>
    </section>
  );
}
