import type { Metadata } from "next";
import Link from "next/link";
import { SellForm } from "@/components/forms/SellForm";
import { PageIntro } from "@/components/common/PageIntro";
import { listMediums, listMovements } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sell",
  description: "Submit a work to be considered for the B-Edge collection.",
};

export default async function SellPage() {
  const [movements, mediums] = await Promise.all([listMovements(), listMediums()]);

  return (
    <main className="min-h-screen bg-gesso text-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 md:px-10">
        <PageIntro
          eyebrow="For artists / Submit your work"
          title="Bring your work into the collection."
          description="B-Edge welcomes original paintings, sculpture, bronze and carving for consideration. Tell us about your practice and the work you would like us to review."
          aside={<Link href="/artists" className="inline-flex min-h-11 items-center border-b border-ink/35 pb-2 font-body text-label uppercase tracking-[0.16em] text-ink hover:border-gilt">Explore artist profiles ↗</Link>}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside>
            <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">What happens next</p>
            <ol className="mt-6 space-y-7">
              {[
                ["01", "Tell us about the work", "Share the title, medium, dimensions and the story behind the piece."],
                ["02", "Gallery review", "Our team reviews the details and considers the work for the collection."],
                ["03", "Continue by email", "We follow up with you about photographs, provenance and next steps."],
              ].map(([number, title, copy]) => (
                <li key={number} className="grid grid-cols-[38px_1fr] gap-4 border-t border-ink/15 pt-4">
                  <span className="font-display text-xl italic text-gilt">{number}</span>
                  <div>
                    <h2 className="font-display text-xl italic text-ink">{title}</h2>
                    <p className="mt-2 font-body text-sm leading-6 text-ink/60">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>

          <section className="bg-white p-6 sm:p-9">
            <p className="font-body text-label uppercase tracking-[0.16em] text-ink/45">Artist submission</p>
            <h2 className="mt-3 font-display text-3xl italic text-ink">Work details</h2>
            <p className="mt-3 max-w-xl font-body text-sm leading-6 text-ink/60">Complete the form below. Required details help us understand the work and respond to your submission.</p>
            <SellForm movements={movements} mediums={mediums} />
          </section>
        </div>
      </div>
    </main>
  );
}
