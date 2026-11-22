import type { ReactNode } from "react";

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
    <div className="flex flex-col items-start gap-4 border-t border-ink/15 py-16">
      <p className="font-body text-label uppercase tracking-[0.18em] text-ink/45">The collection is growing</p>
      <h2 className="font-display text-3xl italic text-ink">{heading}</h2>
      <p className="max-w-md font-body text-base leading-7 text-ink/60">{children}</p>
      {action}
    </div>
  );
}
