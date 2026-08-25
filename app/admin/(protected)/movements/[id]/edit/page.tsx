import { notFound } from "next/navigation";
import { MovementForm } from "@/components/admin/MovementForm";
import { getMovementById } from "@/lib/data";
import { updateMovement } from "../../actions";

export default async function EditMovementPage({ params }: { params: { id: string } }) {
  const movement = await getMovementById(params.id);
  if (!movement) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Edit movement</h1>
      <div className="mt-8">
        <MovementForm action={updateMovement.bind(null, movement.id)} movement={movement} />
      </div>
    </div>
  );
}
