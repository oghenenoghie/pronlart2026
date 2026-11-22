"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/artworks", label: "Artworks" },
      { href: "/admin/artworks?status=sold", label: "Archive" },
      { href: "/admin/artists", label: "Artists" },
      { href: "/admin/mediums", label: "Mediums" },
      { href: "/admin/movements", label: "Movements" },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/enquiries", label: "Enquiries" },
      { href: "/admin/submissions", label: "Sell submissions" },
      { href: "/admin/contact", label: "Contact messages" },
    ],
  },
  {
    label: "Settings",
    items: [{ href: "/admin/settings", label: "Home page" }],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const status = useSearchParams().get("status");

  return (
    <nav aria-label="Studio navigation" className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-7 lg:overflow-visible lg:pb-0">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="shrink-0">
          <p className="mb-2 hidden px-3 font-body text-[0.6rem] uppercase tracking-[0.2em] text-ash lg:block">
            {group.label}
          </p>
          <div className="flex gap-1 lg:grid lg:gap-1">
            {group.items.map((item) => {
              const [itemPath, itemQuery] = item.href.split("?");
              const itemStatus = itemQuery ? new URLSearchParams(itemQuery).get("status") : null;
              const active =
                itemPath === "/admin"
                  ? pathname === "/admin"
                  : Boolean(pathname?.startsWith(itemPath)) && status === itemStatus;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block whitespace-nowrap border-b-2 px-3 py-2.5 font-body text-[0.69rem] transition-colors lg:border-b-0 lg:border-l-2 lg:py-2.5 lg:text-sm",
                    active
                      ? "border-gilt bg-white/5 text-gesso"
                      : "border-transparent text-ash hover:bg-white/5 hover:text-gesso"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
