import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { MovementHero } from "@/components/art/MovementHero";
import { getMovement, listArtworks } from "@/lib/data";
import { supabaseImageUrl } from "@/lib/og-image";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movement = await getMovement(params.slug);
  if (!movement) return {};

  return {
    title: movement.name,
    description: movement.summary,
    openGraph: movement.heroImage
      ? {
          title: movement.name,
          description: movement.summary,
          images: [{ url: supabaseImageUrl(movement.heroImage), alt: movement.name }],
        }
      : undefined,
    twitter: movement.heroImage
      ? { card: "summary_large_image", title: movement.name, description: movement.summary, images: [supabaseImageUrl(movement.heroImage)] }
      : undefined,
  };
}

export default async function MovementPage({ params }: { params: { slug: string } }) {
  const movement = await getMovement(params.slug);
  if (!movement) notFound();

  const artworks = await listArtworks({ movement: movement.slug });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {movement.heroImage && <MovementHero path={movement.heroImage} alt={`${movement.name} — ${movement.summary}`} />}

      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">{movement.era}</p>
      <h1 className="mt-3 font-display text-display-lg italic text-gesso">{movement.name}</h1>
      <p className="mt-6 max-w-2xl font-body text-lede text-ash">{movement.blurb}</p>

      <div className="mt-16 border-t border-line pt-12">
        <h2 className="font-display text-h2 italic text-gesso">Works in this movement</h2>

        {artworks.length === 0 ? (
          <p className="mt-6 font-body text-ash">No works yet — check back soon.</p>
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
