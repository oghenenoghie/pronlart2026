import type { Metadata } from "next";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { LinkButton } from "@/components/ui/button";
import { listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold and past works — a permanent record of what has shown at Pronlart.",
};

export default async function ArchivePage() {
  const artworks = await listArtworks({ status: "sold" });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <h1 className="font-display text-display-lg italic text-gesso">Archive</h1>
        <p className="mt-3 max-w-xl font-body text-lede text-ash">
          Sold works stay on the record — a provenance trail, not a deletion.
        </p>
      </Reveal>

      {artworks.length === 0 ? (
        <EmptyState heading="Nothing has sold yet" action={<LinkButton href="/gallery">Browse the gallery</LinkButton>}>
          The archive begins the day the first work sells — every sold piece stays on the record here.
        </EmptyState>
      ) : (
        <StaggerGroup className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <StaggerItem key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
