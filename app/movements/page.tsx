import type { Metadata } from "next";
import Link from "next/link";
import { listMovementsWithCounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Movements",
  description: "Thirteen movements, from Renaissance to Bronze — the classes that curate every work in the gallery.",
};

export default async function MovementsPage() {
  const movements = (await listMovementsWithCounts()).sort((a, b) => a.sort - b.sort);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">Movements</h1>
      <p className="mt-3 max-w-xl font-body text-lede text-ash">
        Thirteen ways of looking at art, from Renaissance to Bronze — each a curated class in its own right.
      </p>

      <ul className="mt-12 divide-y divide-line border-t border-line">
        {movements.map((movement) => (
          <li key={movement.slug}>
            <Link
              href={`/movements/${movement.slug}`}
              className="group flex items-baseline justify-between gap-6 py-6"
            >
              <div>
                <span className="font-body text-label tabular-nums text-ash">
                  {String(movement.sort).padStart(2, "0")}
                </span>
                <h2 className="mt-1 font-display text-h2 italic text-gesso transition-colors group-hover:text-gilt">
                  {movement.name}
                </h2>
                <p className="mt-1 font-body text-sm text-ash">{movement.summary}</p>
              </div>
              <span className="shrink-0 font-body text-sm tabular-nums text-ash">
                {movement.artworkCount} {movement.artworkCount === 1 ? "work" : "works"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
