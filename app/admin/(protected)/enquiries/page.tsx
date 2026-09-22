import { listEnquiries } from "@/lib/data";
import { formatPrice } from "@/lib/money";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { setEnquiryStatus } from "./actions";

const STATUSES = ["open", "responded", "closed"] as const;

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Enquiries</h1>

      {enquiries.length === 0 ? (
        <p className="mt-8 font-body text-ash">No enquiries yet.</p>
      ) : (
        <table className="mt-8 w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">Artwork</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">From</th>
              <th className="pb-3 pr-4">Offer</th>
              <th className="pb-3 pr-4">Message</th>
              <th className="pb-3 pr-4">Received</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b border-line/50 align-top font-body text-sm text-gesso">
                <td className="py-3 pr-4">{enquiry.artwork?.title ?? "—"}</td>
                <td className="py-3 pr-4 text-ash">{enquiry.type}</td>
                <td className="py-3 pr-4 text-ash">
                  <div>{enquiry.name}</div>
                  <div className="text-xs">{enquiry.email}</div>
                </td>
                <td className="py-3 pr-4 tabular-nums text-ash">
                  {enquiry.offer !== null ? formatPrice(enquiry.offer, "NGN") : "—"}
                </td>
                <td className="max-w-xs py-3 pr-4 text-ash">{enquiry.message ?? "—"}</td>
                <td className="py-3 pr-4 tabular-nums text-ash">
                  {new Date(enquiry.created_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <StatusSelect
                    action={setEnquiryStatus.bind(null, enquiry.id)}
                    current={enquiry.status}
                    options={STATUSES}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
