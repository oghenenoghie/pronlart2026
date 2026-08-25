import Link from "next/link";
import { listMovements } from "@/lib/data";

export default async function AdminMovementsPage() {
  const movements = await listMovements();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Movements</h1>
      <p className="mt-2 font-body text-sm text-ash">
        The 13-movement taxonomy is fixed — edit each entry&apos;s copy and hero image below.
      </p>

      <table className="mt-8 w-full min-w-[480px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
            <th className="pb-3 pr-4">#</th>
            <th className="pb-3 pr-4">Name</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id} className="border-b border-line/50 font-body text-sm text-gesso">
              <td className="py-3 pr-4 tabular-nums text-ash">{String(movement.sort).padStart(2, "0")}</td>
              <td className="py-3 pr-4">{movement.name}</td>
              <td className="py-3 text-right">
                <Link href={`/admin/movements/${movement.id}/edit`} className="text-ash hover:text-gesso">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
