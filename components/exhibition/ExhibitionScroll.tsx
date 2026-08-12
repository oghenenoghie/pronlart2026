"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Placard } from "@/components/art/Placard";
import { useLenis } from "@/components/motion/LenisProvider";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { Artwork } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * The signature cinematic exhibition: featured works pinned full-viewport,
 * each resolving into focus and handing off to the next as the visitor
 * scrolls. A single scroll-linked progress value (0-1 across the whole
 * section) drives every slide's opacity/scale/blur/parallax, so adjacent
 * works crossfade continuously with no dead zones between them.
 */
export function ExhibitionScroll({ works }: { works: Artwork[] }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const canAnimate = !reduce && works.length > 1;

  useEffect(() => {
    if (!canAnimate) return;

    const count = works.length;
    const segment = 1 / count;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        works.forEach((_, i) => {
          const frame = frameRefs.current[i];
          const text = textRefs.current[i];
          if (!frame || !text) return;

          const center = (i + 0.5) * segment;
          const distance = clamp01(Math.abs(progress - center) / segment);
          const opacity = 1 - distance;
          const resolve = clamp01(1 - distance / 0.3);

          gsap.set(frame, {
            opacity,
            scale: 1 + (1 - resolve) * 0.06,
            filter: `blur(${(1 - resolve) * 12}px)`,
          });
          gsap.set(text, {
            opacity: clamp01((opacity - 0.6) / 0.4),
            y: (1 - resolve) * 16,
          });
        });
      },
    });

    return () => trigger.kill();
  }, [canAnimate, works]);

  useEffect(() => {
    if (!lenis || !canAnimate) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    return () => lenis.off("scroll", update);
  }, [lenis, canAnimate]);

  useEffect(() => {
    if (!canAnimate) return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const setters = frameRefs.current.map((el) => (el ? gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }) : null));
    const settersY = frameRefs.current.map((el) => (el ? gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }) : null));

    function handleMove(e: MouseEvent) {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      setters.forEach((set) => set?.(relX * 16));
      settersY.forEach((set) => set?.(relY * 16));
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [canAnimate]);

  if (!canAnimate) {
    return (
      <div className="space-y-24 py-24">
        {works.map((artwork) => (
          <div key={artwork.id} className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
            <ArtworkImage artwork={artwork} className="w-full max-w-xl border border-line" />
            <Placard artwork={artwork} className="items-center text-center [&>*]:mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section ref={containerRef} style={{ height: `${works.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {works.map((artwork, i) => (
          <div key={artwork.id} className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
            <div
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
              className="flex h-[52vh] w-full origin-center items-center justify-center"
            >
              <ArtworkImage artwork={artwork} className="h-full max-w-[85vw] border border-line" />
            </div>
            <div
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="w-full max-w-md text-center"
            >
              <Placard artwork={artwork} className="items-center text-center [&>*]:mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
