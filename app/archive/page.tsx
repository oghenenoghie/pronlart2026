import type { Metadata } from "next";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { listArtworks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold and past works — a permanent record of what has shown at Pronlart.",
};

export default async function ArchivePage() {
  const artworks = await listArtworks({ status: "sold" });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">Archive</h1>
      <p className="mt-3 max-w-xl font-body text-lede text-ash">
        Sold works stay on the record — a provenance trail, not a deletion.
      </p>

      {artworks.length === 0 ? (
        <p className="mt-16 border-t border-line pt-12 font-body text-ash">
          Nothing has sold yet — the archive begins here.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
