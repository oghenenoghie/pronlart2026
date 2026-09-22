import { notFound } from "next/navigation";
import { ArtistForm } from "@/components/admin/ArtistForm";
import { getArtistById } from "@/lib/data";
import { updateArtist } from "../../actions";

export default async function EditArtistPage({ params }: { params: { id: string } }) {
  const artist = await getArtistById(params.id);
  if (!artist) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Edit artist</h1>
      <div className="mt-8">
        <ArtistForm action={updateArtist.bind(null, artist.id)} artist={artist} />
      </div>
    </div>
  );
}
