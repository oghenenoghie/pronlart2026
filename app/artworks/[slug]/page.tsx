import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { StatusChip } from "@/components/art/StatusChip";
import { EnquireSection } from "@/components/art/EnquireSection";
import { getArtwork } from "@/lib/data";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artwork = await getArtwork(params.slug);
  if (!artwork) return {};
  return {
    title: `${artwork.title} — ${artwork.artist.name}`,
    description: artwork.description,
  };
}

export default async function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug);
  if (!artwork) notFound();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2">
      <ArtworkImage artwork={artwork} className="border border-line" priority />

      <div>
        <Link
          href={`/movements/${artwork.movement.slug}`}
          className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso"
        >
          {artwork.movement.name}
        </Link>

        <h1 className="mt-3 font-display text-display-lg italic text-gesso">{artwork.title}</h1>
        <Link
          href={`/artists/${artwork.artist.slug}`}
          className="mt-2 block font-body text-lede text-ash hover:text-gesso"
        >
          {artwork.artist.name}
        </Link>

        <dl className="mt-8 space-y-2 border-y border-line py-6">
          <div className="flex justify-between">
            <dt className="font-body text-sm text-ash">Year</dt>
            <dd className="font-body text-sm tabular-nums text-gesso">{artwork.year}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-body text-sm text-ash">Materials</dt>
            <dd className="font-body text-sm text-gesso">{artwork.materials}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-body text-sm text-ash">Dimensions</dt>
            <dd className="font-body text-sm tabular-nums text-gesso">{artwork.dimensions}</dd>
          </div>
          {artwork.edition && (
            <div className="flex justify-between">
              <dt className="font-body text-sm text-ash">Edition</dt>
              <dd className="font-body text-sm tabular-nums text-gesso">{artwork.edition}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="font-body text-sm text-ash">Availability</dt>
            <dd>
              <StatusChip status={artwork.status} />
            </dd>
          </div>
        </dl>

        <p className="mt-6 font-body leading-relaxed text-ash">{artwork.description}</p>

        <EnquireSection
          artworkSlug={artwork.slug}
          price={artwork.price}
          currency={artwork.currency}
          status={artwork.status}
        />
      </div>
    </div>
  );
}
