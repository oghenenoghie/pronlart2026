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
  const isHome = pathname === "/";

  useEffect(() => setOpen(false), [pathname]);

  const mutedLink = isHome
    ? "text-ink/55 hover:text-ink"
    : "text-ash hover:text-gesso";
  const activeLink = isHome ? "text-ink" : "text-gesso";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        isHome ? "border-ink/10 bg-gesso" : "border-line bg-ink",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="B-Edge Artworks home">
          <Logo className="h-9 w-9 shrink-0" />
          <span
            className={cn(
              "font-display text-lg italic tracking-[-0.02em]",
              isHome ? "text-ink" : "text-gesso",
            )}
          >
            B-Edge Artworks
          </span>
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
                  active ? activeLink : mutedLink,
                  item.href === "/sell" && isHome && "border border-ink/20 px-4 hover:border-gilt",
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
          className={cn(
            "flex h-11 w-11 items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2",
            isHome
              ? "border-ink/20 text-ink focus-visible:ring-offset-gesso"
              : "border-line text-gesso focus-visible:ring-offset-ink",
            "md:hidden",
          )}
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
        aria-label="Mobile navigation"
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows] duration-300 ease-out md:hidden",
          isHome ? "border-ink/10" : "border-line",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="min-h-0">
          <ul
            className={cn(
              "flex flex-col divide-y px-6",
              isHome ? "divide-ink/10" : "divide-line",
            )}
          >
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center font-body text-label uppercase tracking-[0.16em]",
                      active ? activeLink : mutedLink,
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
