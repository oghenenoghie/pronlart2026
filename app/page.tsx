import { ExhibitionScroll } from "@/components/exhibition/ExhibitionScroll";
import { ExhibitionSpotlight } from "@/components/home/ExhibitionSpotlight";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SellCallout } from "@/components/home/SellCallout";
import { getFeaturedArtworks, MOCK_ARTWORKS, MOVEMENTS_WITH_COUNTS } from "@/lib/mock-data";

export default function Home() {
  const featured = getFeaturedArtworks();
  const movements = [...MOVEMENTS_WITH_COUNTS].sort((a, b) => a.sort - b.sort).slice(0, 7);
  const sellArtwork = MOCK_ARTWORKS.find((a) => !a.featured) ?? MOCK_ARTWORKS[MOCK_ARTWORKS.length - 1];

  return (
    <main>
      <HeroCarousel works={featured} />
      <ExhibitionScroll works={featured} />
      <ExhibitionSpotlight featured={featured} movements={movements} />
      <SellCallout artwork={sellArtwork} />
      <section className="mx-auto max-w-6xl border-t border-line px-6 py-16 text-center">
        <a
          href="/gallery"
          className="font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
        >
          View the full gallery →
        </a>
      </section>
    </main>
  );
}
