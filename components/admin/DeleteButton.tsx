"use client";

export function DeleteButton({
  action,
  confirmMessage = "Delete this? This can't be undone.",
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="font-body text-xs uppercase tracking-[0.12em] text-red-700 transition-colors hover:text-red-900"
      >
        {label}
      </button>
    </form>
  );
}
