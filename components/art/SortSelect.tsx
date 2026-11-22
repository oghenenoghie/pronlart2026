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
    <label className="flex items-center gap-3">
      <span className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">Sort by</span>
      <select
        value={active}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value === "newest") params.delete("sort");
          else params.set("sort", event.target.value);
          const query = params.toString();
          router.push(query ? pathname + "?" + query : pathname, { scroll: false });
        }}
        className="min-h-10 border border-ink/15 bg-white px-3 font-body text-sm text-ink focus:border-gilt focus:outline-none focus:ring-1 focus:ring-gilt"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-ink">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
