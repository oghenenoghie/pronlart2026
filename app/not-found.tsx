import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-gesso text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10">
        <p className="font-body text-label uppercase tracking-[0.18em] text-ink/45">404 / Not found</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,6rem)] leading-[1.02] tracking-[-0.035em] text-ink">
          This work isn't <span className="italic">here.</span>
        </h1>
        <p className="mt-6 max-w-lg font-body text-base leading-7 text-ink/60">The page may have moved, or the address may be incorrect. The collection is still open to explore.</p>
        <Link href="/gallery" className="mt-9 inline-flex min-h-12 items-center bg-ink px-6 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">Return to the gallery ↗</Link>
      </div>
    </main>
  );
}
