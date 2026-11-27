"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  type AnimationPlaybackControls,
  type PanInfo,
} from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types";

const SLIDE_SECONDS = 6.5;
const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-bleed featured-work carousel for the home hero. Artwork is shown whole
 * on a light matte, with captions and controls overlaid at the bottom.
 */
export function HeroSlides({ works }: { works: Artwork[] }) {
  const slides = works.filter((work) => work.images.length > 0);
  const count = slides.length;

  const reduce = useReducedMotion();
  const regionRef = useRef<HTMLElement>(null);
  const inView = useInView(regionRef, { amount: 0.35 });

  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const dragged = useRef(false);

  const timed = count > 1 && !reduce;
  const running = timed && !stopped && !hovered && inView && pageVisible;
  const runningRef = useRef(running);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    runningRef.current = running;
    const current = controls.current;
    if (!current) return;
    if (running) current.play();
    else current.pause();
  }, [running]);

  useEffect(() => {
    if (count < 2) return;
    progress.set(0);
    const timer = animate(progress, 1, {
      duration: SLIDE_SECONDS,
      ease: "linear",
      onComplete: () => setIndex((i) => (i + 1) % count),
    });
    controls.current = timer;
    if (!runningRef.current) timer.pause();
    return () => {
      timer.stop();
      controls.current = null;
    };
  }, [index, count, progress]);

  if (count === 0) return null;

  const active = slides[Math.min(index, count - 1)];

  function onKeyDown(event: React.KeyboardEvent) {
    if (count < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  }

  function onFocus(event: React.FocusEvent) {
    if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) {
      setStopped(true);
    }
  }

  function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(index + 1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(index - 1);
  }

  return (
    <section
      ref={regionRef}
      className="relative h-full min-h-[560px] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured works"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
    >
      <motion.div
        className="absolute inset-0 h-full w-full"
        drag={count > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onPointerDownCapture={() => {
          dragged.current = false;
        }}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={onDragEnd}
        style={{ touchAction: "pan-y" }}
      >
        <Link
          href={"/artworks/" + active.slug}
          aria-label={"View " + active.title + " by " + active.artist.name}
          draggable={false}
          onClick={(event) => {
            if (dragged.current) {
              event.preventDefault();
              dragged.current = false;
            }
          }}
          className="group absolute inset-0 block h-full w-full overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt"
        >
          {slides.map((work, i) => {
            const image = work.images.find((img) => img.isPrimary) ?? work.images[0];
            const isActive = i === index;
            return (
              <motion.div
                key={work.id}
                aria-hidden={!isActive}
                className="absolute inset-0"
                initial={false}
                animate={
                  isActive
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: reduce ? 1 : 1.04 }
                }
                transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
              >
                <Image
                  src={image.path}
                  alt={isActive ? image.alt : ""}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  draggable={false}
                  className="select-none object-contain p-8 sm:p-12 lg:p-20"
                />
              </motion.div>
            );
          })}
        </Link>
      </motion.div>

      <div className="absolute bottom-24 left-6 right-6 z-10 min-h-[5rem] max-w-xl border-b border-ink/20 pb-3 sm:left-10 lg:left-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-body text-label uppercase tracking-[0.16em] text-ink/55">
                Featured work
                {count > 1 && (
                  <span className="ml-3 tabular-nums text-ink/45">
                    {pad(index + 1)} / {pad(count)}
                  </span>
                )}
              </p>
              <p className="mt-2 font-display text-xl italic text-ink sm:text-2xl">
                {active.title}, {active.year}
              </p>
              <p className="mt-1 font-body text-sm text-ink/65">{active.artist.name}</p>
            </div>
            <p className="max-w-[13rem] text-right font-body text-sm leading-6 text-ink/65">
              {active.medium.name} <span aria-hidden>·</span> {active.dimensions}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="sr-only" aria-live={running ? "off" : "polite"} aria-atomic="true">
        {count > 1
          ? "Slide " + (index + 1) + " of " + count + ": " + active.title + " by " + active.artist.name
          : ""}
      </p>

      {count > 1 && (
        <div className="absolute bottom-3 left-6 right-6 z-20 flex items-center gap-5 sm:left-10 lg:left-16">
          <ol className="flex flex-1 gap-2 sm:gap-3">
            {slides.map((work, i) => {
              const isActive = i === index;
              return (
                <li key={work.id} className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={"Show slide " + (i + 1) + " of " + count + ": " + work.title}
                    aria-current={isActive ? "true" : undefined}
                    className="group/dot flex min-h-11 w-full flex-col justify-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-gesso"
                  >
                    <span
                      className={cn(
                        "font-body text-[0.68rem] uppercase tabular-nums tracking-[0.14em] transition-colors duration-200",
                        isActive ? "text-ink" : "text-ink/40 group-hover/dot:text-ink/70",
                      )}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="relative block h-[2px] w-full overflow-hidden bg-ink/10">
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 origin-left bg-gilt"
                          style={{ scaleX: timed ? progress : 1 }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="flex shrink-0 items-center">
            <ControlButton label="Previous work" onClick={() => go(index - 1)}>
              <path d="M15 6l-6 6 6 6" />
            </ControlButton>
            {timed && (
              <ControlButton
                label={stopped ? "Play slideshow" : "Pause slideshow"}
                onClick={() => setStopped((value) => !value)}
              >
                {stopped ? <path d="M8 5.5v13l11-6.5z" /> : <path d="M9 5.5v13M15 5.5v13" />}
              </ControlButton>
            )}
            <ControlButton label="Next work" onClick={() => go(index + 1)}>
              <path d="M9 6l6 6-6 6" />
            </ControlButton>
          </div>
        </div>
      )}
    </section>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="-ml-px flex h-11 w-11 items-center justify-center border border-ink/15 text-ink/70 transition-colors duration-200 hover:z-10 hover:border-ink hover:text-ink focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-gesso"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        {children}
      </svg>
    </button>
  );
}
