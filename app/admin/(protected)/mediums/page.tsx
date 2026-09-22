import Link from "next/link";
import { listMediums } from "@/lib/data";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { submitButton } from "@/components/admin/form-styles";
import { deleteMedium } from "./actions";

export default async function AdminMediumsPage() {
  const mediums = await listMediums();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-h2 italic text-gesso">Mediums</h1>
        <Link href="/admin/mediums/new" className={submitButton}>
          New medium
        </Link>
      </div>

      {mediums.length === 0 ? (
        <p className="mt-8 font-body text-ash">No mediums yet.</p>
      ) : (
        <table className="mt-8 w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Slug</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {mediums.map((medium) => (
              <tr key={medium.id} className="border-b border-line/50 font-body text-sm text-gesso">
                <td className="py-3 pr-4">{medium.name}</td>
                <td className="py-3 pr-4 text-ash">{medium.slug}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/mediums/${medium.id}/edit`} className="text-ash hover:text-gesso">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteMedium.bind(null, medium.id)}
                      confirmMessage={`Delete "${medium.name}"? This can't be undone.`}
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
