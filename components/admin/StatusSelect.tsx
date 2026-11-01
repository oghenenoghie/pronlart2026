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
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-line bg-ink px-2 py-1 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
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
