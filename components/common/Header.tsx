"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";

const NAV = [
  { href: "/gallery", label: "Gallery" },
  { href: "/movements", label: "Movements" },
  { href: "/artists", label: "Artists" },
  { href: "/archive", label: "Archive" },
  { href: "/sell", label: "Sell your work" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // The private workspace has its own navigation and should not inherit public-site chrome.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-gesso/95 text-ink backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="B-Edge Artworks home">
          <Logo className="h-9 w-9 shrink-0" />
          <span className="font-display text-lg italic tracking-[-0.02em] text-ink">B-Edge Artworks</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center font-body text-[0.68rem] uppercase tracking-[0.16em] transition-colors",
                  active ? "text-ink" : "text-ink/55 hover:text-ink",
                  active && "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gilt",
                  item.href === "/sell" && "border border-ink/20 px-4 hover:border-gilt",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-gesso md:hidden"
        >
          <span className="relative block h-3 w-4" aria-hidden>
            <span className={cn("absolute left-0 top-0 h-px w-4 bg-current transition-transform", open && "translate-y-[6px] rotate-45")} />
            <span className={cn("absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity", open && "opacity-0")} />
            <span className={cn("absolute left-0 top-3 h-px w-4 bg-current transition-transform", open && "-translate-y-[6px] -rotate-45")} />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={cn(
          "grid overflow-hidden border-t border-ink/10 transition-[grid-template-rows] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col divide-y divide-ink/10 px-6">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center font-body text-label uppercase tracking-[0.16em]",
                      active ? "text-ink" : "text-ink/55",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
