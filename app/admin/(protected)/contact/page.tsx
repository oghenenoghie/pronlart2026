import { listContactMessages } from "@/lib/data";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { setContactMessageStatus } from "./actions";

const STATUSES = ["open", "responded", "closed"] as const;

export default async function AdminContactPage() {
  const messages = await listContactMessages();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Contact messages</h1>

      {messages.length === 0 ? (
        <p className="mt-8 font-body text-ash">No messages yet.</p>
      ) : (
        <table className="mt-8 w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-body text-label uppercase tracking-[0.18em] text-ash">
              <th className="pb-3 pr-4">From</th>
              <th className="pb-3 pr-4">Message</th>
              <th className="pb-3 pr-4">Received</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-b border-line/50 align-top font-body text-sm text-gesso">
                <td className="py-3 pr-4 text-ash">
                  <div>{message.name}</div>
                  <div className="text-xs">{message.email}</div>
                </td>
                <td className="max-w-md py-3 pr-4 text-ash">{message.message}</td>
                <td className="py-3 pr-4 tabular-nums text-ash">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <StatusSelect
                    action={setContactMessageStatus.bind(null, message.id)}
                    current={message.status}
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
