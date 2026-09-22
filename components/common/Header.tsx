import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/gallery", label: "Gallery" },
  { href: "/movements", label: "Movements" },
  { href: "/artists", label: "Artists" },
  { href: "/archive", label: "Archive" },
  { href: "/sell", label: "Sell" },
];

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-light.png"
            alt="B-Edge Artworks"
            width={1523}
            height={301}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
