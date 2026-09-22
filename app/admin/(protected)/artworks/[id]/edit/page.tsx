import { notFound } from "next/navigation";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { getArtworkById, listArtists, listMediums, listMovements } from "@/lib/data";
import { updateArtwork } from "../../actions";

export default async function EditArtworkPage({ params }: { params: { id: string } }) {
  const [artwork, artists, movements, mediums] = await Promise.all([
    getArtworkById(params.id),
    listArtists(),
    listMovements(),
    listMediums(),
  ]);
  if (!artwork) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Edit artwork</h1>
      <div className="mt-8">
        <ArtworkForm
          action={updateArtwork.bind(null, artwork.id)}
          artwork={artwork}
          artists={artists}
          movements={movements}
          mediums={mediums}
        />
      </div>
    </div>
  );
}
