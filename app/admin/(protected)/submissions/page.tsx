import { listSellSubmissions } from "@/lib/data";
import { formatPrice } from "@/lib/money";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { convertSubmissionToArtwork, setSellSubmissionStatus } from "./actions";

const STATUSES = ["pending", "accepted", "declined"] as const;

export default async function AdminSubmissionsPage() {
  const submissions = await listSellSubmissions();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Sell submissions</h1>

      {submissions.length === 0 ? (
        <p className="mt-8 font-body text-ash">No submissions yet.</p>
      ) : (
        <table className="mt-8 w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Artist</th>
              <th className="pb-3 pr-4">Movement</th>
              <th className="pb-3 pr-4">Medium</th>
              <th className="pb-3 pr-4">Asking</th>
              <th className="pb-3 pr-4">Received</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b border-line/50 align-top font-body text-sm text-gesso">
                <td className="py-3 pr-4">{submission.title}</td>
                <td className="py-3 pr-4 text-ash">
                  <div>{submission.artist_name}</div>
                  <div className="text-xs">{submission.artist_email}</div>
                </td>
                <td className="py-3 pr-4 text-ash">{submission.movement?.name ?? "—"}</td>
                <td className="py-3 pr-4 text-ash">{submission.medium?.name ?? "—"}</td>
                <td className="py-3 pr-4 tabular-nums text-ash">
                  {formatPrice(submission.asking_price, submission.currency)}
                </td>
                <td className="py-3 pr-4 tabular-nums text-ash">
                  {new Date(submission.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <StatusSelect
                    action={setSellSubmissionStatus.bind(null, submission.id)}
                    current={submission.status}
                    options={STATUSES}
                  />
                </td>
                <td className="py-3">
                  <form action={convertSubmissionToArtwork.bind(null, submission.id)}>
                    <button type="submit" className="font-body text-sm text-ash transition-colors hover:text-gesso">
                      Convert to artwork
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
