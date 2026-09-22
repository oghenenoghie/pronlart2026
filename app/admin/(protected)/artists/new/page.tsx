import { ArtistForm } from "@/components/admin/ArtistForm";
import { createArtist } from "../actions";

export default function NewArtistPage() {
  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">New artist</h1>
      <div className="mt-8">
        <ArtistForm action={createArtist} />
      </div>
    </div>
  );
}
