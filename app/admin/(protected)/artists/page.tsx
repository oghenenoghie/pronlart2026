import Link from "next/link";
import { listArtists } from "@/lib/data";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { submitButton } from "@/components/admin/form-styles";
import { deleteArtist } from "./actions";

export default async function AdminArtistsPage() {
  const artists = await listArtists();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-h2 italic text-gesso">Artists</h1>
        <Link href="/admin/artists/new" className={submitButton}>
          New artist
        </Link>
      </div>

      {artists.length === 0 ? (
        <p className="mt-8 font-body text-ash">No artists yet.</p>
      ) : (
        <table className="mt-8 w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="border-b border-line/50 font-body text-sm text-gesso">
                <td className="py-3 pr-4">{artist.name}</td>
                <td className="py-3 pr-4 text-ash">{artist.status}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/artists/${artist.id}/edit`} className="text-ash hover:text-gesso">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteArtist.bind(null, artist.id)}
                      confirmMessage={`Delete "${artist.name}"? This can't be undone.`}
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
