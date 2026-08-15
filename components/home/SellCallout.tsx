import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import type { Artwork } from "@/types";

const TRUST_MARKS = [
  "13 Movements",
  "Verified Provenance",
  "Museum Framing",
  "Worldwide Shipping",
  "Artist Royalties",
  "Buyer Protection",
];

/**
 * Dark band pitching the sell flow, handing off to a white-cube trust
 * strip. The image is optional — a work in the current exhibition if one's
 * available — so this section never depends on inventory existing.
 */
export function SellCallout({ artwork }: { artwork?: Artwork }) {
  return (
    <section className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 md:grid-cols-2 md:gap-20">
        <Reveal>
          {artwork ? (
            <ArtworkImage artwork={artwork} className="w-full border border-line" />
          ) : (
            <div className="aspect-[4/5] w-full border border-line" style={{ background: "hsl(40 8% 10%)" }} />
          )}
        </Reveal>

        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">◆ Sell</p>
          <h2 className="mt-3 font-display text-display-lg font-bold text-gesso">
            How Do I Get My Work Shown?
          </h2>
          <p className="mt-6 max-w-md font-body text-body text-ash">
            Artists submit original paintings, sculpture and bronze for review. Accepted work
            joins the collection online and in the archive, priced and placed alongside the
            gallery&rsquo;s represented artists, with provenance carried through to sale.
          </p>
          <Link
            href="/sell"
            className="mt-8 inline-block border border-gilt px-8 py-3 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
          >
            Submit Your Work
          </Link>
        </Reveal>
      </div>

      <div className="border-t border-line bg-gesso">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8 px-6 py-10 text-center sm:grid-cols-6">
          {TRUST_MARKS.map((mark) => (
            <div key={mark} className="flex flex-col items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 font-display text-lg italic text-ink">
                {mark.charAt(0)}
              </span>
              <span className="font-body text-[0.65rem] uppercase leading-tight tracking-[0.12em] text-ink/70">
                {mark}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
