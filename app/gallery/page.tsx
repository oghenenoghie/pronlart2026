import { Suspense } from "react";
import type { Metadata } from "next";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { FacetRail } from "@/components/art/FacetRail";
import { SortSelect } from "@/components/art/SortSelect";
import { listArtworks, type ArtworkFilters } from "@/lib/data";
import { MOVEMENTS_WITH_COUNTS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse original paintings, sculpture and bronze — filter by movement and availability.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { movement?: string; status?: ArtworkFilters["status"]; sort?: ArtworkFilters["sort"] };
}) {
  const artworks = await listArtworks({
    movement: searchParams.movement,
    status: searchParams.status,
    sort: searchParams.sort,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">Gallery</h1>
      <p className="mt-3 max-w-xl font-body text-lede text-ash">
        Original works, available to buy or enquire on. Filter by movement or availability.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[220px_1fr]">
        <aside>
          <Suspense fallback={null}>
            <FacetRail movements={MOVEMENTS_WITH_COUNTS} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
            <p className="font-body text-sm text-ash">
              {artworks.length} {artworks.length === 1 ? "work" : "works"}
            </p>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          {artworks.length === 0 ? (
            <p className="font-body text-ash">No works match these filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
