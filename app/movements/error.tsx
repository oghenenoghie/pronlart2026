"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24">
      <p className="font-body text-ash">Movements couldn&apos;t be loaded.</p>
      <button
        onClick={reset}
        className="border border-line px-4 py-2 font-body text-label uppercase tracking-[0.18em] text-gesso hover:border-gilt"
      >
        Try again
      </button>
    </div>
  );
}
