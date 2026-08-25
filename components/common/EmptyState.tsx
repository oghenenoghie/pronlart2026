import type { ReactNode } from "react";

/** Editorial empty state — a heading and explanation, not a bare status line. */
export function EmptyState({
  heading,
  children,
  action,
}: {
  heading: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 border-t border-line py-16">
      <h2 className="font-display text-h2 italic text-gesso">{heading}</h2>
      <p className="max-w-md font-body text-ash">{children}</p>
      {action}
    </div>
  );
}
