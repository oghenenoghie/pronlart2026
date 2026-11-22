import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/common/PageIntro";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { listMovementsWithCounts, listArtworks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Movements",
  description: "Explore the ideas, periods and practices that shape the B-Edge art collection.",
};

export default async function MovementsPage() {
  const [movements, artworks] = await Promise.all([listMovementsWithCounts(), listArtworks()]);
  const ordered = [...movements].sort((a, b) => a.sort - b.sort);

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="A way into the collection"
          title="Explore by movement."
          description="Art is always in conversation with its time. Explore the movements, methods and material traditions that give the collection its shape."
          aside={<p className="font-display text-3xl italic text-ink">13 <span className="font-body text-xs not-italic uppercase tracking-[0.14em] text-ink/45">ways of seeing</span></p>}
        />

        <StaggerGroup as="ul" className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((movement) => {
            const representative = artworks.find((artwork) => artwork.movement.id === movement.id && artwork.images.length > 0);
            const representativeImage = representative?.images.find((image) => image.isPrimary) ?? representative?.images[0];
            const imagePath = movement.heroImage ?? representativeImage?.path;

            return (
              <StaggerItem as="li" key={movement.slug}>
                <Link href={"/movements/" + movement.slug} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-4">
                  <div className="relative aspect-[5/4] overflow-hidden border border-ink/10 bg-white">
                    {imagePath ? (
                      <Image src={imagePath} alt={movement.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
                    ) : (
                      <div className="flex h-full items-end p-5"><span className="font-display text-3xl italic text-ink/25">{movement.name}</span></div>
                    )}
                    <span className="absolute left-4 top-4 bg-gesso/90 px-3 py-2 font-body text-[0.62rem] uppercase tracking-[0.16em] text-ink/60">{String(movement.sort).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl italic text-ink group-hover:text-ink/60">{movement.name}</h2>
                    <span className="shrink-0 font-body text-xs text-ink/45">{movement.artworkCount} {movement.artworkCount === 1 ? "work" : "works"}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 font-body text-sm leading-6 text-ink/60">{movement.summary}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </main>
  );
}
