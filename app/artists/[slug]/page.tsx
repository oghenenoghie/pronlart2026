import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArtist, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

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
      <Reveal>
        <h1 className="font-display text-display-lg italic text-gesso">{artist.name}</h1>
        {artist.statement && <p className="mt-4 max-w-2xl font-body text-lede text-ash">{artist.statement}</p>}
        {artist.bio && <p className="mt-4 max-w-2xl font-body leading-relaxed text-ash">{artist.bio}</p>}
      </Reveal>

      <div className="mt-16 border-t border-line pt-12">
        <h2 className="font-display text-h2 italic text-gesso">Works</h2>

        {artworks.length === 0 ? (
          <EmptyState heading="No works listed yet">
            {artist.name} doesn&apos;t have any works in the gallery yet — check back soon.
          </EmptyState>
        ) : (
          <StaggerGroup className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <StaggerItem key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </div>
  );
}
