import { Reveal } from "@/components/motion/Reveal";
import { ExhibitionScroll } from "@/components/exhibition/ExhibitionScroll";
import { ExhibitionSpotlight } from "@/components/home/ExhibitionSpotlight";
import { SellCallout } from "@/components/home/SellCallout";
import { LinkButton } from "@/components/ui/button";
import { getFeaturedArtworks, getMovementsWithCounts, getSellCalloutArtwork } from "@/lib/data";

export default async function Home() {
  const [featured, movementsWithCounts, sellArtwork] = await Promise.all([
    getFeaturedArtworks(),
    getMovementsWithCounts(),
    getSellCalloutArtwork(),
  ]);
  const movements = [...movementsWithCounts].sort((a, b) => a.sort - b.sort).slice(0, 7);

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
            <LinkButton href="/gallery">Enter the gallery</LinkButton>
            <LinkButton href="/movements" variant="ghost">
              Explore movements
            </LinkButton>
          </div>
        </Reveal>
      </section>

      <ExhibitionScroll works={featured} />

      <ExhibitionSpotlight featured={featured} movements={movements} />

      {sellArtwork && <SellCallout artwork={sellArtwork} />}

      <Reveal>
        <section className="mx-auto max-w-6xl border-t border-line px-6 py-16 text-center">
          <LinkButton href="/gallery" variant="ghost">
            View the full gallery →
          </LinkButton>
        </section>
      </Reveal>
    </main>
  );
}
