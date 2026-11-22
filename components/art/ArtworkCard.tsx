import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Placard } from "@/components/art/Placard";
import { StatusChip } from "@/components/art/StatusChip";
import type { Artwork } from "@/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <article className="group min-w-0">
      <Link
        href={"/artworks/" + artwork.slug}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4"
        aria-label={"View " + artwork.title + " by " + artwork.artist.name}
      >
        <div className="overflow-hidden border border-ink/10 bg-white transition-colors duration-300 group-hover:border-gilt/60">
          <ArtworkImage artwork={artwork} className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <Link href={"/artworks/" + artwork.slug} className="min-w-0 flex-1">
          <Placard artwork={artwork} />
        </Link>
        <StatusChip status={artwork.status} className="shrink-0 pt-0.5" />
      </div>
    </article>
  );
}
