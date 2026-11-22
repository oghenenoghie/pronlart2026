"use client";

export function StatusSelect<T extends string>({
  action,
  current,
  options,
  labels,
}: {
  action: (formData: FormData) => void | Promise<void>;
  current: T;
  options: readonly T[];
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        aria-label="Update status"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="min-h-9 border border-ink/15 bg-white px-2.5 py-1.5 font-body text-xs text-ink focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </form>
  );
}
