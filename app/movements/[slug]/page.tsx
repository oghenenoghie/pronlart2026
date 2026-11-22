import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { MovementHero } from "@/components/art/MovementHero";
import { EmptyState } from "@/components/common/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getMovement, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movement = await getMovement(params.slug);
  if (!movement) return {};
  return {
    title: movement.name,
    description: movement.summary,
    openGraph: movement.heroImage ? { title: movement.name, description: movement.summary, images: [{ url: movement.heroImage, alt: movement.name }] } : undefined,
    twitter: movement.heroImage ? { card: "summary_large_image", title: movement.name, description: movement.summary, images: [movement.heroImage] } : undefined,
  };
}

export default async function MovementPage({ params }: { params: { slug: string } }) {
  const movement = await getMovement(params.slug);
  if (!movement) notFound();

  const artworks = await listArtworks({ movement: movement.slug });
  const firstWithImage = artworks.find((artwork) => artwork.images.length > 0);
  const primary = firstWithImage?.images.find((image) => image.isPrimary) ?? firstWithImage?.images[0];
  const heroImage = movement.heroImage ?? primary?.path;

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <Reveal>
          <div className="mb-8 flex items-center gap-3 font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">
            <Link href="/movements" className="hover:text-ink">Movements</Link>
            <span aria-hidden className="text-gilt">/</span>
            <span>{movement.era}</span>
          </div>
          {heroImage ? <MovementHero path={heroImage} alt={movement.name + " — " + movement.summary} /> : null}
        </Reveal>

        <div className="grid gap-8 border-b border-ink/15 pb-10 md:grid-cols-[1fr_0.7fr] md:items-end md:gap-16">
          <Reveal>
            <p className="font-body text-label uppercase tracking-[0.18em] text-ink/45">{movement.era} / Movement {String(movement.sort).padStart(2, "0")}</p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">{movement.name}</h1>
          </Reveal>
          <Reveal>
            <p className="font-display text-xl italic leading-relaxed text-ink/75">{movement.blurb}</p>
            <p className="mt-4 font-body text-sm leading-7 text-ink/55">{movement.summary}</p>
          </Reveal>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">In the collection</p>
              <h2 className="mt-3 font-display text-3xl italic text-ink">Works in {movement.name}</h2>
            </div>
            <span className="font-body text-sm text-ink/50">{artworks.length} {artworks.length === 1 ? "work" : "works"}</span>
          </div>

          {artworks.length === 0 ? (
            <EmptyState heading="The collection is still growing">No works have been catalogued under {movement.name} yet. Explore another movement or return as new pieces are added.</EmptyState>
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
