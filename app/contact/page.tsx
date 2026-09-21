import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/ContactForm";

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
        <ContactForm />
      </Reveal>

      <Reveal>
        <div className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-h3 italic text-gesso">Regional representatives</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {REPRESENTATIVES.map((rep) => (
              <div key={rep.region}>
                <p className="font-body text-label uppercase tracking-[0.18em] text-gilt">{rep.region}</p>
                {rep.name && <p className="mt-2 font-display text-lg italic text-gesso">{rep.name}</p>}
                {rep.phone && (
                  <a href={`tel:${rep.phone}`} className="mt-1 block font-body text-sm text-ash hover:text-gesso">
                    {rep.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

const REPRESENTATIVES = [
  { region: "The Netherlands & Europe", name: "Fabian", phone: "+31 6 13723963" },
  { region: "UK & Ireland", name: "Gerald", phone: "+447916157480" },
  { region: "Nigeria", name: null, phone: "0811 399 6181" },
];
