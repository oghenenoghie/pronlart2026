import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-body text-placard text-ash">
          © {new Date().getFullYear()} B-Edge Artworks. All works reserved to their artists.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso">
            About
          </Link>
          <Link href="/contact" className="font-body text-label uppercase tracking-[0.18em] text-ash hover:text-gesso">
            Contact
          </Link>
          <a
            href="https://www.facebook.com/share/1HqvMCmgA4/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="B-Edge Artworks on Facebook"
            className="text-ash hover:text-gesso"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
