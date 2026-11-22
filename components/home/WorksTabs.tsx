"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SelectedWorkCard } from "@/components/home/SelectedWorkCard";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types";

export type WorksTab = {
  key: string;
  label: string;
  total: number;
  works: Artwork[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tabs that switch the "Selected works" grid between the whole collection
 * and each medium. A gilt hairline slides to the chosen tab and the cards
 * swap with a short staggered fade. Follows the WAI tabs pattern: arrow
 * keys, Home and End move between tabs and select them.
 */
export function WorksTabs({ tabs }: { tabs: WorksTab[] }) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];
  if (!active) return null;

  const showTabs = tabs.length > 1;
  const tabId = (key: string) => baseId + "-tab-" + key;
  const panelId = baseId + "-panel";

  function select(i: number) {
    const tab = tabs[(i + tabs.length) % tabs.length];
    setActiveKey(tab.key);
    tabRefs.current[(i + tabs.length) % tabs.length]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, i: number) {
    const moves: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  }

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
    exit: { opacity: 0, transition: { duration: reduce ? 0.1 : 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.15 : 0.5, ease: EASE } },
  };

  return (
    <div>
      {!showTabs && <div className="mt-8 border-b border-ink/10" />}
      {showTabs && (
        <div
          role="tablist"
          aria-label="Selected works by medium"
          className="no-scrollbar mt-8 flex gap-7 overflow-x-auto border-b border-ink/10"
        >
          {tabs.map((tab, i) => {
            const selected = tab.key === active.key;
            return (
              <button
                key={tab.key}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={tabId(tab.key)}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveKey(tab.key)}
                onKeyDown={(event) => onKeyDown(event, i)}
                className={cn(
                  "relative flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap font-body text-label uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gilt",
                  selected ? "text-ink" : "text-ink/45 hover:text-ink/75",
                )}
              >
                {tab.label}
                <span className="tabular-nums text-ink/35">{tab.total}</span>
                {selected && (
                  <motion.span
                    layoutId={baseId + "-indicator"}
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-gilt"
                    transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.45 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div
        id={panelId}
        role={showTabs ? "tabpanel" : undefined}
        aria-labelledby={showTabs ? tabId(active.key) : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={active.key}
            variants={list}
            initial="hidden"
            animate="show"
            exit="exit"
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {active.works.map((work) => (
              <motion.li key={work.id} variants={item}>
                <SelectedWorkCard work={work} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
