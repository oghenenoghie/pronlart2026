import { notFound } from "next/navigation";
import { MediumForm } from "@/components/admin/MediumForm";
import { getMediumById } from "@/lib/data";
import { updateMedium } from "../../actions";

export default async function EditMediumPage({ params }: { params: { id: string } }) {
  const medium = await getMediumById(params.id);
  if (!medium) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Edit medium</h1>
      <div className="mt-8">
        <MediumForm action={updateMedium.bind(null, medium.id)} medium={medium} />
      </div>
    </div>
  );
}
