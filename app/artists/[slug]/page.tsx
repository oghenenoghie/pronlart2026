import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { getArtist, listArtworks } from "@/lib/data";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await getArtist(params.slug);
  if (!artist) return {};
  return {
    title: artist.name,
    description: artist.statement,
  };
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  const artworks = await listArtworks({ artist: artist.slug });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">{artist.name}</h1>
      {artist.statement && <p className="mt-4 max-w-2xl font-body text-lede text-ash">{artist.statement}</p>}
      {artist.bio && <p className="mt-4 max-w-2xl font-body leading-relaxed text-ash">{artist.bio}</p>}

      <div className="mt-16 border-t border-line pt-12">
        <h2 className="font-display text-h2 italic text-gesso">Works</h2>

        {artworks.length === 0 ? (
          <p className="mt-6 font-body text-ash">No works listed yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
