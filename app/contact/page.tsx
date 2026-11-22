import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/common/PageIntro";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with B-Edge Artworks.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="Start a conversation"
          title="We'd like to hear from you."
          description="Ask us about a work, the collection, artist submissions or working with B-Edge. For a specific artwork, you can also enquire directly from its page."
          aside={<Link href="mailto:hello@b-edgeartworks.com" className="font-display text-lg italic text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">hello@b-edgeartworks.com ↗</Link>}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] lg:gap-20">
          <section>
            <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">Send a message</p>
            <h2 className="mt-3 font-display text-3xl italic text-ink">How can we help?</h2>
            <ContactForm />
          </section>

          <aside className="border-t border-ink/15 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">Reach the gallery</p>
            <div className="mt-5">
              <p className="font-display text-xl italic text-ink">General enquiries</p>
              <a href="mailto:hello@b-edgeartworks.com" className="mt-2 block font-body text-sm text-ink/65 underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">hello@b-edgeartworks.com</a>
            </div>
            <div className="mt-9 border-t border-ink/10 pt-7">
              <h3 className="font-display text-2xl italic text-ink">Regional representatives</h3>
              <div className="mt-6 space-y-6">
                {REPRESENTATIVES.map((rep) => (
                  <div key={rep.region}>
                    <p className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">{rep.region}{rep.main ? " · Main office" : ""}</p>
                    {rep.name && <p className="mt-1 font-display text-lg italic text-ink">{rep.name}</p>}
                    <a href={"tel:" + rep.phone.replace(/[^d+]/g, "")} className="mt-1 inline-block font-body text-sm text-ink/65 hover:text-ink">{rep.phone}</a>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const REPRESENTATIVES = [
  { region: "Lagos, Nigeria", name: null, phone: "0811 399 6181", main: true },
  { region: "The Netherlands & Europe", name: "Fabian", phone: "+31 6 13723963", main: false },
  { region: "UK & Ireland", name: "Gerald", phone: "+447916157480", main: false },
];
