import Link from "next/link";
import { listArtworks } from "@/lib/data";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { submitButton } from "@/components/admin/form-styles";
import type { ArtworkStatus } from "@/types";
import { deleteArtwork } from "./actions";

const FILTERS: { label: string; status?: ArtworkStatus }[] = [
  { label: "All" },
  { label: "Available", status: "available" },
  { label: "Reserved", status: "reserved" },
  { label: "Archive (Sold)", status: "sold" },
];

function isArtworkStatus(value: string | undefined): value is ArtworkStatus {
  return value === "available" || value === "reserved" || value === "sold";
}

export default async function AdminArtworksPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = isArtworkStatus(searchParams.status) ? searchParams.status : undefined;
  const artworks = await listArtworks({ status, sort: "newest" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-h2 italic text-gesso">
          {status === "sold" ? "Archive" : "Artworks"}
        </h1>
        <Link href="/admin/artworks/new" className={submitButton}>
          New artwork
        </Link>
      </div>

      <nav className="mt-6 flex flex-wrap gap-4 border-b border-line pb-4">
        {FILTERS.map((filter) => {
          const href = filter.status ? `/admin/artworks?status=${filter.status}` : "/admin/artworks";
          const active = filter.status === status;
          return (
            <Link
              key={filter.label}
              href={href}
              className={cn(
                "font-body text-label uppercase tracking-[0.18em] transition-colors",
                active ? "text-gilt" : "text-ash hover:text-gesso"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {artworks.length === 0 ? (
        <p className="mt-8 font-body text-ash">
          {status === "sold" ? "Nothing has sold yet." : "No artworks yet."}
        </p>
      ) : (
        <table className="mt-8 w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Artist</th>
              <th className="pb-3 pr-4">Movement</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork) => (
              <tr key={artwork.id} className="border-b border-line/50 font-body text-sm text-gesso">
                <td className="py-3 pr-4">{artwork.title}</td>
                <td className="py-3 pr-4 text-ash">{artwork.artist.name}</td>
                <td className="py-3 pr-4 text-ash">{artwork.movement.name}</td>
                <td className="py-3 pr-4 text-ash">{artwork.status}</td>
                <td className="py-3 pr-4 tabular-nums text-ash">{formatPrice(artwork.price, artwork.currency)}</td>
                <td className="py-3 pr-4 text-ash">{artwork.featured ? "Yes" : ""}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/artworks/${artwork.id}/edit`} className="text-ash hover:text-gesso">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteArtwork.bind(null, artwork.id)}
                      confirmMessage={`Delete "${artwork.title}"? This can't be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
