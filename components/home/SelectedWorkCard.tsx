import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { formatPrice } from "@/lib/money";
import type { Artwork } from "@/types";

export function SelectedWorkCard({ work }: { work: Artwork }) {
  const availability =
    work.status === "sold"
      ? "In the archive"
      : work.status === "reserved"
        ? "Reserved"
        : formatPrice(work.price, work.currency);

  return (
    <Link
      href={"/artworks/" + work.slug}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4"
      aria-label={"View " + work.title + " by " + work.artist.name}
    >
      <div className="overflow-hidden border border-ink/10 transition-colors duration-300 group-hover:border-gilt/60">
        <ArtworkImage artwork={work} className="w-full" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-body text-label uppercase tracking-[0.16em] text-ink/50">
            {work.artist.name}
          </p>
          <h3 className="mt-2 font-display text-xl italic text-ink transition-colors group-hover:text-ink/65">
            {work.title}, {work.year}
          </h3>
          <p className="mt-2 font-body text-sm text-ink/60">{work.materials || work.medium.name}</p>
          <p className="mt-1 font-body text-sm text-ink/50">{work.dimensions}</p>
        </div>
        <span className="shrink-0 pt-1 font-body text-xs tabular-nums text-ink/65">
          {availability}
        </span>
      </div>
    </Link>
  );
}
