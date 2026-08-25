import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "About Pronlart — a curated marketplace for original art.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <h1 className="font-display text-display-lg italic text-gesso">About</h1>
        <div className="mt-8 space-y-6 font-body leading-relaxed text-ash">
          <p>
            Pronlart brings artists and collectors together around original artworks — paintings,
            sculpture, bronze and carving, curated by movement and shown the way a gallery would
            show them: art first, chrome second.
          </p>
          <p>
            Every work carries a museum-quality label — artist, title, year, medium, dimensions and
            price — set consistently everywhere it appears, from the gallery grid to the archive.
          </p>
          <p>
            Artists can submit work to sell directly; sold and past works stay on the permanent
            record in the archive rather than disappearing.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
