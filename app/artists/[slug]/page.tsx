import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArtist, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await getArtist(params.slug);
  if (!artist) return {};
  return { title: artist.name, description: artist.statement ?? artist.bio };
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);
  if (!artist) notFound();

  const artworks = await listArtworks({ artist: artist.slug });
  const firstArtwork = artworks.find((artwork) => artwork.images.length > 0) ?? artworks[0];
  const primary = firstArtwork?.images.find((image) => image.isPrimary) ?? firstArtwork?.images[0];
  const profileImage = artist.portrait ?? primary?.path;

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <Reveal>
            <p className="font-body text-label uppercase tracking-[0.18em] text-ink/45">Artist profile / B-Edge collection</p>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,5.5vw,5rem)] font-medium leading-[1.03] tracking-[-0.03em] text-ink">{artist.name}</h1>
            {artist.statement && <p className="mt-7 font-display text-2xl italic leading-relaxed text-ink/75">{artist.statement}</p>}
            {artist.bio && <div className="mt-6 space-y-4 font-body text-base leading-8 text-ink/60"><p>{artist.bio}</p></div>}
            <div className="mt-9 flex flex-wrap items-center gap-5 border-t border-ink/15 pt-5">
              <span className="font-body text-xs uppercase tracking-[0.14em] text-ink/50">{artworks.length} {artworks.length === 1 ? "work" : "works"} in the collection</span>
              <Link href="/artists" className="font-body text-label uppercase tracking-[0.14em] text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">All artists</Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="border border-ink/10 bg-white p-2">
              {profileImage ? (
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={profileImage}
                    alt={artist.portrait ? artist.name : firstArtwork?.title + " by " + artist.name}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    priority
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[5/4] items-end p-8"><span className="font-display text-4xl italic text-ink/25">{artist.name}</span></div>
              )}
            </div>
            {primary && !artist.portrait && <p className="mt-3 font-body text-xs uppercase tracking-[0.15em] text-ink/45">A work by {artist.name}</p>}
          </Reveal>
        </div>

        <section className="mt-20 border-t border-ink/15 pt-10 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">Selected collection</p>
              <h2 className="mt-3 font-display text-3xl italic text-ink">Works by {artist.name}</h2>
            </div>
            <Link href="/gallery" className="font-body text-label uppercase tracking-[0.15em] text-ink/60 underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">Browse all works ↗</Link>
          </div>

          {artworks.length === 0 ? (
            <EmptyState heading="No works listed yet">This artist does not have any works in the gallery at the moment. Visit again as the collection grows.</EmptyState>
          ) : (
            <StaggerGroup className="mt-9 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((artwork) => (
                <StaggerItem key={artwork.id}><ArtworkCard artwork={artwork} /></StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </section>
      </div>
    </main>
  );
}
