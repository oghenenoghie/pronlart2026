import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <Reveal>
        <p className="font-body text-label uppercase tracking-[0.18em] text-ash">
          Pronlart
        </p>
        <h1 className="mt-4 font-display text-display-lg italic text-gesso">
          A gallery, built to be walked.
        </h1>
        <p className="mt-6 font-body text-lede text-ash">
          The scaffold is in place — cinematic exhibition, gallery, movements
          and archive are next.
        </p>
        <div className="mx-auto mt-10 h-px w-24 bg-gilt/40" />
      </Reveal>
    </main>
  );
}
