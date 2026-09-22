import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { listArtists, listMediums, listMovements } from "@/lib/data";
import { createArtwork } from "../actions";

export default async function NewArtworkPage() {
  const [artists, movements, mediums] = await Promise.all([listArtists(), listMovements(), listMediums()]);

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">New artwork</h1>
      <div className="mt-8">
        <ArtworkForm action={createArtwork} artists={artists} movements={movements} mediums={mediums} />
      </div>
    </div>
  );
}
