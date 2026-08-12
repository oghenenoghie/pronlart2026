import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/money";
import type { Artwork } from "@/types";

export function Placard({ artwork, className }: { artwork: Artwork; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">{artwork.artist.name}</p>
      <p className="font-display text-placard italic text-gesso">
        {artwork.title}, {artwork.year}
      </p>
      <p className="font-body text-placard text-ash">{artwork.materials}</p>
      <p className="font-body text-placard tabular-nums text-ash">{artwork.dimensions}</p>
      <p className="font-body text-placard font-medium text-gesso">
        {formatPrice(artwork.price, artwork.currency)}
      </p>
    </div>
  );
}
