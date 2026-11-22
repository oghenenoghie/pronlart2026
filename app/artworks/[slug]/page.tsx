import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { StatusChip } from "@/components/art/StatusChip";
import { EnquireSection } from "@/components/art/EnquireSection";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArtwork, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artwork = await getArtwork(params.slug);
  if (!artwork) return {};

  const primary = artwork.images.find((image) => image.isPrimary) ?? artwork.images[0];
  const title = artwork.title + " — " + artwork.artist.name;

  return {
    title,
    description: artwork.description,
    openGraph: primary ? {
      title,
      description: artwork.description,
      images: [{ url: primary.path, width: primary.width, height: primary.height, alt: primary.alt }],
    } : undefined,
    twitter: primary ? { card: "summary_large_image", title, description: artwork.description, images: [primary.path] } : undefined,
  };
}

export default async function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const artwork = await getArtwork(params.slug);
  if (!artwork) notFound();

  const artistWorks = (await listArtworks({ artist: artwork.artist.slug }))
    .filter((work) => work.id !== artwork.id && work.status !== "sold")
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14 md:px-10">
        <Link href="/gallery" className="inline-flex min-h-10 items-center font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/50 hover:text-ink">
          <span aria-hidden className="mr-3 text-lg">←</span> Back to the gallery
        </Link>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <Reveal>
            <div className="border border-ink/10 bg-white p-2">
              <ArtworkImage artwork={artwork} className="w-full" priority />
            </div>
            {artwork.images.length > 1 && (
              <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-ink/40">{artwork.images.length} images in this work</p>
            )}
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={"/movements/" + artwork.movement.slug} className="font-body text-[0.65rem] uppercase tracking-[0.17em] text-ink/50 underline decoration-ink/20 underline-offset-4 hover:decoration-gilt">{artwork.movement.name}</Link>
              <span aria-hidden className="text-gilt">/</span>
              <StatusChip status={artwork.status} />
            </div>

            <h1 className="mt-5 font-display text-[clamp(2.7rem,5vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">{artwork.title}</h1>
            <Link href={"/artists/" + artwork.artist.slug} className="mt-4 inline-block font-display text-2xl italic text-ink/65 hover:text-ink">{artwork.artist.name}</Link>

            <div className="mt-8 border-y border-ink/15 py-5">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <dt className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-ink/45">Year</dt>
                  <dd className="mt-1 font-body text-sm tabular-nums text-ink">{artwork.year}</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-ink/45">Medium</dt>
                  <dd className="mt-1 font-body text-sm text-ink">{artwork.medium.name}</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-ink/45">Materials</dt>
                  <dd className="mt-1 font-body text-sm text-ink">{artwork.materials}</dd>
                </div>
                <div>
                  <dt className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-ink/45">Dimensions</dt>
                  <dd className="mt-1 font-body text-sm tabular-nums text-ink">{artwork.dimensions}</dd>
                </div>
                {artwork.edition && (
                  <div>
                    <dt className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-ink/45">Edition</dt>
                    <dd className="mt-1 font-body text-sm tabular-nums text-ink">{artwork.edition}</dd>
                  </div>
                )}
              </dl>
            </div>

            <p className="mt-7 whitespace-pre-line font-body text-base leading-8 text-ink/65">{artwork.description}</p>

            <EnquireSection
              artworkSlug={artwork.slug}
              price={artwork.price}
              currency={artwork.currency}
              status={artwork.status}
            />
          </Reveal>
        </div>

        {artistWorks.length > 0 && (
          <section className="mt-20 border-t border-ink/15 pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">Continue exploring</p>
                <h2 className="mt-3 font-display text-3xl italic text-ink">More by {artwork.artist.name}</h2>
              </div>
              <Link href={"/artists/" + artwork.artist.slug} className="font-body text-label uppercase tracking-[0.15em] text-ink/55 underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">Artist profile ↗</Link>
            </div>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {artistWorks.map((work) => (
                <StaggerItem key={work.id}><ArtworkCard artwork={work} /></StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}
      </div>
    </main>
  );
}
