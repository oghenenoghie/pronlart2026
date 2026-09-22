import Link from "next/link";
import Image from "next/image";
import type { MovementWithCount } from "@/lib/data";

export function MovementsTeaser({ movements }: { movements: MovementWithCount[] }) {
  const sorted = [...movements].sort((a, b) => a.sort - b.sort);

  return (
    <section className="mx-auto max-w-6xl border-t border-line px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-h2 italic text-gesso">Explore by movement</h2>
        <Link
          href="/movements"
          className="shrink-0 font-body text-label uppercase tracking-[0.18em] text-ash transition-colors hover:text-gesso"
        >
          All movements →
        </Link>
      </div>

      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
        {sorted.map((movement) => (
          <Link
            key={movement.id}
            href={`/movements/${movement.slug}`}
            className="group block w-[45vw] shrink-0 snap-start sm:w-[28vw] lg:w-[220px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-line transition-colors group-hover:border-gilt/50">
              {movement.heroImage ? (
                <Image
                  src={movement.heroImage}
                  alt={movement.name}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 28vw, 45vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full" style={{ background: "hsl(40 8% 10%)" }} />
              )}
            </div>
            <p className="mt-3 font-display text-base italic text-gesso transition-colors group-hover:text-gilt">
              {movement.name}
            </p>
            <p className="font-body text-xs uppercase tracking-[0.18em] text-ash">
              {movement.artworkCount} {movement.artworkCount === 1 ? "work" : "works"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
