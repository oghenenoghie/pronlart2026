import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ExhibitionSpotlight } from "@/components/home/ExhibitionSpotlight";
import { SellCallout } from "@/components/home/SellCallout";
import { getFeaturedArtworks, MOCK_ARTWORKS, MOVEMENTS_WITH_COUNTS } from "@/lib/mock-data";

export default function Home() {
  const featured = getFeaturedArtworks();
  const movements = [...MOVEMENTS_WITH_COUNTS].sort((a, b) => a.sort - b.sort).slice(0, 7);
  const sellArtwork = MOCK_ARTWORKS.find((a) => !a.featured) ?? MOCK_ARTWORKS[MOCK_ARTWORKS.length - 1];

  return (
    <main>
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-ash">Pronlart</p>
          <h1 className="mt-4 font-display text-display-lg italic text-gesso">
            A gallery, built to be walked.
          </h1>
          <p className="mt-6 font-body text-lede text-ash">
            Original paintings, sculpture and bronze — browse by movement, buy or enquire,
            and explore the archive.
          </p>
          <div className="mx-auto mt-10 h-px w-24 bg-gilt/40" />
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              href="/gallery"
              className="border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
            >
              Enter the gallery
            </Link>
            <Link
              href="/movements"
              className="font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
            >
              Explore movements
            </Link>
          </div>
        </Reveal>
      </section>

      <ExhibitionSpotlight featured={featured} movements={movements} />

      <SellCallout artwork={sellArtwork} />

      <section className="mx-auto max-w-6xl border-t border-line px-6 py-16 text-center">
        <Link
          href="/gallery"
          className="font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
        >
          View the full gallery →
        </Link>
      </section>
    </main>
  );
}
