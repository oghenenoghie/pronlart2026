import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-body text-placard text-ash">
          © {new Date().getFullYear()} Pronlart. All works reserved to their artists.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso">
            About
          </Link>
          <Link href="/contact" className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
