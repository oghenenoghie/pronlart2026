"use client";

import { motion, useReducedMotion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

type GroupTag = "div" | "ul";
type ItemTag = "div" | "li";

const GROUP_TAGS: Record<GroupTag, typeof motion.div | typeof motion.ul> = {
  div: motion.div,
  ul: motion.ul,
};

const ITEM_TAGS: Record<ItemTag, typeof motion.div | typeof motion.li> = {
  div: motion.div,
  li: motion.li,
};

/** Wraps a grid/list of cards so they reveal in a gentle stagger as it scrolls into view. */
export function StaggerGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: GroupTag;
}) {
  const reduce = useReducedMotion();
  const Tag = as === "ul" ? "ul" : "div";
  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = GROUP_TAGS[as];
  return (
    <MotionTag className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, as = "div" }: { children: React.ReactNode; as?: ItemTag }) {
  const MotionTag = ITEM_TAGS[as];
  return <MotionTag variants={item}>{children}</MotionTag>;
}
