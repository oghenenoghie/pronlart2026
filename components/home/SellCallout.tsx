import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/button";
import type { SiteImage } from "@/types";

export function SellCallout({ image }: { image?: SiteImage }) {
  return (
    <section className="border-t border-line bg-ink text-gesso">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-28 md:grid-cols-[1.05fr_0.95fr] md:gap-20 md:px-10">
        <Reveal>
          {image ? (
            <div
              className="relative w-full overflow-hidden border border-line"
              style={{ aspectRatio: image.width + " / " + image.height }}
            >
              <Image
                src={image.path}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] w-full border border-line bg-white/5" aria-hidden />
          )}
        </Reveal>

        <Reveal>
          <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">
            For artists <span className="ml-2">/</span> Share your work
          </p>
          <h2 className="mt-4 font-display text-display-lg font-medium leading-tight text-gesso">
            Your work deserves to be seen.
          </h2>
          <p className="mt-6 max-w-lg font-body text-base leading-8 text-ash">
            B-Edge welcomes original paintings, sculpture and bronze for consideration. Tell us
            about your practice and the work you would like to bring into the collection.
          </p>
          <LinkButton href="/sell" className="mt-8">
            Submit your artwork <span aria-hidden className="ml-3 text-lg">↗</span>
          </LinkButton>
        </Reveal>
      </div>

      <div className="border-t border-line bg-gesso text-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-6 py-8 text-center sm:grid-cols-3 md:grid-cols-6 md:px-10">
          {["Original work", "13 movements", "Artist profiles", "Permanent archive", "Enquiries", "Submissions"].map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="font-display text-2xl italic text-ink/65">0{index + 1}</span>
              <span className="font-body text-[0.65rem] uppercase leading-tight tracking-[0.12em] text-ink/65">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
