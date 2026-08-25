import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared style for text/email/number/textarea/select form fields. */
export const fieldClass =
  "mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso placeholder:text-ash/60 focus:border-gilt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gilt focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

/** Shared style for a field's label. */
export const fieldLabelClass = "font-body text-label uppercase tracking-[0.18em] text-ash";

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
