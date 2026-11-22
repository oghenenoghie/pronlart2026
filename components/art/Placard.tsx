import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/money";
import type { Artwork } from "@/types";

export function Placard({ artwork, className }: { artwork: Artwork; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="font-body text-label uppercase tracking-[0.16em] text-ink/50">{artwork.artist.name}</p>
      <p className="font-display text-lg italic text-ink">
        {artwork.title}, {artwork.year}
      </p>
      <p className="font-body text-sm text-ink/60">{artwork.materials || artwork.medium.name}</p>
      <p className="font-body text-sm tabular-nums text-ink/50">{artwork.dimensions}</p>
      <p className="font-body text-sm font-medium tabular-nums text-ink">
        {formatPrice(artwork.price, artwork.currency)}
      </p>
    </div>
  );
}
