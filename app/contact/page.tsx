import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pronlart.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">Contact</h1>
      <p className="mt-6 max-w-xl font-body text-lede text-ash">
        For enquiries about a specific work, use the enquire button on its page — that reaches us
        fastest. For everything else, write to us directly.
      </p>
      <a
        href="mailto:hello@pronlart.example"
        className="mt-8 inline-block border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
      >
        hello@pronlart.example
      </a>
    </div>
  );
}
