import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pronlart.",
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
        <a href="mailto:hello@pronlart.example" className={buttonClass("primary", "mt-8")}>
          hello@pronlart.example
        </a>
      </Reveal>
    </div>
  );
}
