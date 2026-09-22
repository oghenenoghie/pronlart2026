import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">404</p>
      <h1 className="font-display text-h2 italic text-gesso">Page not found</h1>
      <Link
        href="/admin"
        className="border border-line px-4 py-2 font-body text-label uppercase tracking-[0.18em] text-gesso hover:border-gilt"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
