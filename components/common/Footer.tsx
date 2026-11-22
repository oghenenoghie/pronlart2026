import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-gesso text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 shrink-0" />
          <div>
            <p className="font-body text-sm text-ink/65">
              © {new Date().getFullYear()} B-Edge Artworks. All works reserved to their artists.
            </p>
            <p className="mt-1 font-body text-xs text-ink/50">
              A property of{" "}
              <a href="https://www.shipcovetrading.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-ink/25 underline-offset-4 hover:decoration-gilt">
                Shipcove Trading
              </a>
            </p>
          </div>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="/about" className="font-body text-label uppercase tracking-[0.16em] text-ink/55 hover:text-ink">About</Link>
          <Link href="/contact" className="font-body text-label uppercase tracking-[0.16em] text-ink/55 hover:text-ink">Contact</Link>
          <a href="https://www.facebook.com/share/1HqvMCmgA4/" target="_blank" rel="noopener noreferrer" className="font-body text-label uppercase tracking-[0.16em] text-ink/55 hover:text-ink">Facebook</a>
        </nav>
      </div>
    </footer>
  );
}
