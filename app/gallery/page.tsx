import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { FacetRail } from "@/components/art/FacetRail";
import { SortSelect } from "@/components/art/SortSelect";
import { EmptyState } from "@/components/common/EmptyState";
import { PageIntro } from "@/components/common/PageIntro";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { listArtworks, listMovementsWithCounts, type ArtworkFilters } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse original paintings, sculpture and bronze — filter by movement and availability.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { movement?: string; status?: ArtworkFilters["status"]; sort?: ArtworkFilters["sort"] };
}) {
  const [artworks, movements] = await Promise.all([
    listArtworks({
      movement: searchParams.movement,
      status: searchParams.status,
      sort: searchParams.sort,
    }),
    listMovementsWithCounts(),
  ]);

  const movementName = movements.find((movement) => movement.slug === searchParams.movement)?.name;
  const hasFilters = Boolean(searchParams.movement || searchParams.status);

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="01 / The collection"
          title="The gallery."
          description="Original paintings, sculpture and bronze, selected for their craft, character and point of view. Explore the collection by movement or availability."
          aside={
            <Link href="/sell" className="inline-flex min-h-11 items-center border-b border-ink/35 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink hover:border-gilt">
              Submit a work <span aria-hidden className="ml-3 text-lg">↗</span>
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">Refine selection</p>
              {hasFilters && <Link href="/gallery" className="font-body text-xs text-ink/60 underline decoration-ink/25 underline-offset-4 hover:text-ink">Clear all</Link>}
            </div>
            <Suspense fallback={null}>
              <FacetRail movements={movements.filter((movement) => movement.artworkCount > 0)} />
            </Suspense>
          </aside>

          <section aria-label="Artworks">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-4">
              <div>
                <p className="font-display text-2xl italic text-ink">{artworks.length} {artworks.length === 1 ? "work" : "works"}</p>
                {hasFilters && <p className="mt-1 font-body text-xs text-ink/50">{[movementName, searchParams.status && searchParams.status.charAt(0).toUpperCase() + searchParams.status.slice(1)].filter(Boolean).join(" · ")}</p>}
              </div>
              <Suspense fallback={null}>
                <SortSelect />
              </Suspense>
            </div>

            {artworks.length === 0 ? (
              <EmptyState
                heading="No works match this selection"
                action={<Link href="/gallery" className="mt-2 inline-flex min-h-11 items-center bg-ink px-5 font-body text-label uppercase tracking-[0.15em] text-gesso hover:bg-gilt hover:text-ink">Clear filters</Link>}
              >
                Try another movement or availability, or clear the filters to return to the full collection.
              </EmptyState>
            ) : (
              <StaggerGroup className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {artworks.map((artwork) => (
                  <StaggerItem key={artwork.id}>
                    <ArtworkCard artwork={artwork} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
