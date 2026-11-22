import type { Metadata } from "next";
import Link from "next/link";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageIntro } from "@/components/common/PageIntro";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold and past works — a permanent record of what has shown at B-Edge Artworks.",
};

export default async function ArchivePage() {
  const artworks = await listArtworks({ status: "sold" });

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="The collection / Permanent record"
          title="The archive."
          description="A record of works that have found their collectors. Each piece remains part of the collection's story, with its artist, materials and provenance details preserved."
          aside={<p className="font-display text-3xl italic text-ink">{String(artworks.length).padStart(2, "0")} <span className="font-body text-xs not-italic uppercase tracking-[0.14em] text-ink/45">archived works</span></p>}
        />

        {artworks.length === 0 ? (
          <div className="mt-12">
            <EmptyState heading="The archive is taking shape">
              When a work finds a new home, it remains here as part of the gallery&apos;s permanent record.
            </EmptyState>
            <Link href="/gallery" className="mt-2 inline-flex min-h-12 items-center bg-ink px-6 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">
              Explore available works <span aria-hidden className="ml-3 text-lg">↗</span>
            </Link>
          </div>
        ) : (
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <StaggerItem key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </main>
  );
}
