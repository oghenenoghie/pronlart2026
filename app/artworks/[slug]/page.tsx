import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { StatusChip } from "@/components/art/StatusChip";
import { EnquireSection } from "@/components/art/EnquireSection";
import { Reveal } from "@/components/motion/Reveal";
import { getArtwork } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artwork = await getArtwork(params.slug);
  if (!artwork) return {};

  const primary = artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];
  const title = `${artwork.title} — ${artwork.artist.name}`;

  return {
    title,
    description: artwork.description,
    openGraph: primary
      ? {
          title,
          description: artwork.description,
          images: [{ url: primary.path, width: primary.width, height: primary.height, alt: primary.alt }],
        }
      : undefined,
    twitter: primary
      ? { card: "summary_large_image", title, description: artwork.description, images: [primary.path] }
      : undefined,
  };
}

export default async function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug);
  if (!artwork) notFound();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2">
      <Reveal>
        <ArtworkImage artwork={artwork} className="border border-line" priority />
      </Reveal>

      <Reveal>
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
      </Reveal>
    </div>
  );
}
