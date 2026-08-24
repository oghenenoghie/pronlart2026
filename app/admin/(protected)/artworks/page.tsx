import Link from "next/link";
import { listArtworks } from "@/lib/data";
import { formatPrice } from "@/lib/money";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { submitButton } from "@/components/admin/form-styles";
import { deleteArtwork } from "./actions";

export default async function AdminArtworksPage() {
  const artworks = await listArtworks({ sort: "newest" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-h2 italic text-gesso">Artworks</h1>
        <Link href="/admin/artworks/new" className={submitButton}>
          New artwork
        </Link>
      </div>

      {artworks.length === 0 ? (
        <p className="mt-8 font-body text-ash">No artworks yet.</p>
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
