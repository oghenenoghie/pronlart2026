import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArtistsWithCounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Artists",
  description: "The artists showing at Pronlart.",
};

export default async function ArtistsPage() {
  const artists = await getArtistsWithCounts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <h1 className="font-display text-display-lg italic text-gesso">Artists</h1>
        <p className="mt-3 max-w-xl font-body text-lede text-ash">
          The makers behind the works in the gallery.
        </p>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-line pt-12 sm:grid-cols-2"
      >
        {artists.map((artist) => (
          <StaggerItem as="li" key={artist.slug}>
            <div className="border-b border-line pb-10">
              <Link href={`/artists/${artist.slug}`} className="group block">
                <h2 className="font-display text-h2 italic text-gesso transition-colors group-hover:text-gilt">
                  {artist.name}
                </h2>
                {artist.statement && <p className="mt-2 font-body text-sm text-ash">{artist.statement}</p>}
                <p className="mt-3 font-body text-label uppercase tracking-[0.18em] text-ash">
                  {artist.artworkCount} {artist.artworkCount === 1 ? "work" : "works"}
                </p>
              </Link>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
