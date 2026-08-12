import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkCard } from "@/components/art/ArtworkCard";
import { getFeaturedArtworks } from "@/lib/mock-data";

export default function Home() {
  const featured = getFeaturedArtworks();

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

      <section className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-h2 italic text-gesso">Featured works</h2>
            <Link href="/gallery" className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso">
              View all
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((artwork) => (
            <Reveal key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
