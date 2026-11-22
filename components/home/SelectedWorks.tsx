import Link from "next/link";
import { WorksTabs, type WorksTab } from "@/components/home/WorksTabs";
import { Reveal } from "@/components/motion/Reveal";
import type { Artwork } from "@/types";

const PER_TAB = 3;

/**
 * Builds one tab for the whole collection plus one per medium, busiest medium
 * first. The "All" tab leads with works that are not already in the hero
 * slideshow, then falls back to them so it is never short.
 */
function buildTabs(works: Artwork[], heroIds: Set<string>): WorksTab[] {
  const fresh = works.filter((work) => !heroIds.has(work.id));
  const seen = works.filter((work) => heroIds.has(work.id));
  const tabs: WorksTab[] = [
    { key: "all", label: "All works", total: works.length, works: [...fresh, ...seen].slice(0, PER_TAB) },
  ];

  const byMedium = new Map<string, { label: string; works: Artwork[] }>();
  for (const work of works) {
    const group = byMedium.get(work.medium.slug);
    if (group) group.works.push(work);
    else byMedium.set(work.medium.slug, { label: work.medium.name, works: [work] });
  }

  if (byMedium.size > 1) {
    const mediums = Array.from(byMedium.entries()).sort((a, b) => b[1].works.length - a[1].works.length);
    for (const [slug, group] of mediums) {
      tabs.push({ key: slug, label: group.label, total: group.works.length, works: group.works.slice(0, PER_TAB) });
    }
  }

  return tabs;
}

export function SelectedWorks({ works, heroIds }: { works: Artwork[]; heroIds: Set<string> }) {
  if (works.length === 0) return null;

  const tabs = buildTabs(works, heroIds);

  return (
    <section className="bg-white px-6 py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-body text-label uppercase tracking-[0.18em] text-ink/50">
                02 / Selected works
              </p>
              <h2 className="mt-4 font-display text-display-lg font-medium leading-tight text-ink">
                A closer look.
              </h2>
            </div>
            <p className="max-w-md font-body text-sm leading-7 text-ink/60">
              A selection of original works from the B-Edge collection. Choose a medium, then open
              a work to explore its story, materials and details.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <WorksTabs tabs={tabs} />
        </Reveal>

        <Reveal>
          <div className="mt-14 flex justify-center">
            <Link
              href="/gallery"
              className="inline-flex min-h-12 items-center border border-ink/25 px-7 py-3 font-body text-label uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-gesso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2"
            >
              View all artworks <span aria-hidden className="ml-4 text-lg">↗</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
