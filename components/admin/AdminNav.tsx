"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/mediums", label: "Mediums" },
  { href: "/admin/movements", label: "Movements" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/settings", label: "Home page" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block border-l-2 py-2 pl-3 font-body text-sm transition-colors",
              active ? "border-gilt text-gesso" : "border-transparent text-ash hover:text-gesso"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
