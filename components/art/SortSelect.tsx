"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "artist", label: "Artist" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") ?? "newest";

  return (
    <label className="flex items-center gap-2">
      <span className="font-body text-label uppercase tracking-[0.18em] text-ash">Sort</span>
      <select
        value={active}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "newest") {
            params.delete("sort");
          } else {
            params.set("sort", e.target.value);
          }
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="border border-line bg-ink px-2 py-1 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink text-gesso">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
