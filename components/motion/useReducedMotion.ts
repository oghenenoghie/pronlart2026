"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe alternative to motion/react's useReducedMotion(), which reads
 * matchMedia synchronously during the client's first render and so
 * mismatches the server-rendered HTML whenever the OS has reduced motion
 * on. This always agrees with the server on first paint (false), then
 * settles to the real value on mount — safe because Reveal/ExhibitionScroll
 * only animate on scroll/scroll-progress, never on that first paint.
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduce;
}
