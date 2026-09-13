import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with B-Edge Artworks.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <h1 className="font-display text-display-lg italic text-gesso">Contact</h1>
        <p className="mt-6 max-w-xl font-body text-lede text-ash">
          For enquiries about a specific work, use the enquire button on its page — that reaches us
          fastest. For everything else, write to us directly.
        </p>
        <a href="mailto:hello@b-edgeartworks.com" className={buttonClass("primary", "mt-8")}>
          hello@b-edgeartworks.com
        </a>
      </Reveal>

      <Reveal>
        <div className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-h3 italic text-gesso">Regional representatives</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {REPRESENTATIVES.map((rep) => (
              <div key={rep.region}>
                <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">{rep.region}</p>
                <p className="mt-2 font-display text-lg italic text-gesso">{rep.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

const REPRESENTATIVES = [
  { region: "The Netherlands & Europe", name: "Fabian" },
  { region: "UK & Ireland", name: "Gerald" },
];
