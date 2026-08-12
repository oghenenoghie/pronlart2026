import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24">
      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">404</p>
      <h1 className="font-display text-h2 italic text-gesso">Page not found</h1>
      <Link
        href="/"
        className="border border-line px-4 py-2 font-body text-label uppercase tracking-[0.18em] text-gesso hover:border-gilt"
      >
        Back to the gallery
      </Link>
    </div>
  );
}
