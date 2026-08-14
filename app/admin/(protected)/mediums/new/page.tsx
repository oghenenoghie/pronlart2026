import { MediumForm } from "@/components/admin/MediumForm";
import { createMedium } from "../actions";

export default function NewMediumPage() {
  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">New medium</h1>
      <div className="mt-8">
        <MediumForm action={createMedium} />
      </div>
    </div>
  );
}
