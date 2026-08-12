import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Placard } from "@/components/art/Placard";
import { StatusChip } from "@/components/art/StatusChip";
import type { Artwork } from "@/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artworks/${artwork.slug}`} className="group block">
      <ArtworkImage
        artwork={artwork}
        className="border border-line transition-colors group-hover:border-gilt/50"
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <Placard artwork={artwork} />
        <StatusChip status={artwork.status} className="shrink-0 pt-0.5" />
      </div>
    </Link>
  );
}
