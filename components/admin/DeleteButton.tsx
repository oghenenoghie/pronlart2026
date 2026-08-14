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
      <button type="submit" className="font-body text-sm text-red-400 transition-colors hover:text-red-300">
        {label}
      </button>
    </form>
  );
}
