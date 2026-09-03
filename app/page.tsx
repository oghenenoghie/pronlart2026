import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { HeroSection } from "@/components/home/HeroSection";
import { ExhibitionSpotlight } from "@/components/home/ExhibitionSpotlight";
import { SellCallout } from "@/components/home/SellCallout";
import { MovementsTeaser } from "@/components/common/MovementsTeaser";
import { getSellCalloutImage, listArtworks, listMovementsWithCounts } from "@/lib/data";

export const dynamic = "force-dynamic";

const EXHIBITION_SIZE = 6;

export default async function Home() {
  const [featured, movements, sellCalloutImage] = await Promise.all([
    listArtworks({ featured: true, sort: "newest" }),
    listMovementsWithCounts(),
    getSellCalloutImage(),
  ]);

  // Never let the signature exhibition go empty just because nothing's been
  // flagged featured yet — fall back to the latest available works.
  const exhibitionWorks =
    featured.length > 0
      ? featured
      : (await listArtworks({ status: "available", sort: "newest" })).slice(0, EXHIBITION_SIZE);

  // The sell pitch image is admin-configurable (/admin/settings); fall back
  // to a work from the current exhibition until one's been set.
  const fallbackArtwork = exhibitionWorks[EXHIBITION_SIZE - 1];
  const fallbackImage = fallbackArtwork?.images.find((img) => img.isPrimary) ?? fallbackArtwork?.images[0];
  const sellImage = sellCalloutImage ?? fallbackImage;

  return (
    <main>
      <HeroSection works={exhibitionWorks} />

      <SellCallout image={sellImage} />

      <ExhibitionSpotlight works={exhibitionWorks} />

      <MovementsTeaser movements={movements} />

      <Reveal>
        <section className="mx-auto max-w-6xl border-t border-line px-6 py-16">
          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:text-left">
            <Link href="/gallery" className="group block">
              <p className="font-display text-h3 italic text-gesso transition-colors group-hover:text-gilt">
                Browse the gallery
              </p>
              <p className="mt-2 font-body text-sm text-ash">Every work, filterable by movement and availability.</p>
            </Link>
            <Link href="/artists" className="group block">
              <p className="font-display text-h3 italic text-gesso transition-colors group-hover:text-gilt">
                Meet the artists
              </p>
              <p className="mt-2 font-body text-sm text-ash">The makers behind the works in the gallery.</p>
            </Link>
            <Link href="/sell" className="group block">
              <p className="font-display text-h3 italic text-gesso transition-colors group-hover:text-gilt">
                Sell a work
              </p>
              <p className="mt-2 font-body text-sm text-ash">Submit an original for consideration.</p>
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
