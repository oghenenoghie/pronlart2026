import { cn } from "@/lib/utils";
import type { ArtworkStatus } from "@/types";

const STATUS_LABEL: Record<ArtworkStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

const STATUS_DOT: Record<ArtworkStatus, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-ash",
};

export function StatusChip({ status, className }: { status: ArtworkStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-body text-label uppercase tracking-[0.18em] text-ash",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
