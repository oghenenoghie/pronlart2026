"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/gallery", label: "Gallery" },
  { href: "/movements", label: "Movements" },
  { href: "/artists", label: "Artists" },
  { href: "/archive", label: "Archive" },
  { href: "/sell", label: "Sell" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change so a link tap doesn't leave it open.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="relative border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg italic text-gesso">
          Pronlart
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-body text-label uppercase tracking-[0.18em] transition-colors hover:text-gesso",
                  active ? "text-gesso" : "text-ash",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center border border-line text-gesso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:hidden"
        >
          <span className="relative block h-3 w-4" aria-hidden>
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-4 bg-current transition-transform",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn("absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity", open && "opacity-0")}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-px w-4 bg-current transition-transform",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden border-t border-line transition-[grid-template-rows] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col divide-y divide-line px-6">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center font-body text-label uppercase tracking-[0.18em]",
                      active ? "text-gesso" : "text-ash",
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
