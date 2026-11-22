"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const format = (n: number) => String(Math.round(n)).padStart(2, "0");

/**
 * A figure that counts up from zero the first time it scrolls into view.
 * The server renders the final value, so it is correct without JavaScript
 * and under prefers-reduced-motion; screen readers only ever hear the final
 * value.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(value);
  const display = useTransform(count, format);

  useEffect(() => {
    if (value <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      count.set(0);
      return;
    }
    const controls = animate(count, value, { duration: 1.4, ease: EASE });
    return () => controls.stop();
  }, [inView, value, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span aria-hidden className="tabular-nums">
        {display}
      </motion.span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
