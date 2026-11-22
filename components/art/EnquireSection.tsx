"use client";

import { useState, type FormEvent } from "react";
import { formatPrice, parseToMinorUnits } from "@/lib/money";
import type { ArtworkStatus } from "@/types";

type Status = "idle" | "open" | "submitting" | "success" | "error";

const inputClass = "mt-2 w-full border border-ink/15 bg-white px-3 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-gilt focus:outline-none focus:ring-1 focus:ring-gilt";
const labelClass = "font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/55";

export function EnquireSection({
  artworkSlug,
  price,
  currency,
  status,
}: {
  artworkSlug: string;
  price: number | null;
  currency: string;
  status: ArtworkStatus;
}) {
  const [formStatus, setFormStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canTransact = status === "available";
  const isPoa = price === null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(event.currentTarget);
    const offerRaw = data.get("offer");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isPoa ? "enquiry" : "purchase",
          artworkSlug,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          offer: offerRaw ? parseToMinorUnits(String(offerRaw), currency) : undefined,
        }),
      });

      if (response.ok) setFormStatus("success");
      else {
        const body = await response.json().catch(() => null);
        setErrorMessage(body?.error ?? "Something went wrong. Please try again.");
        setFormStatus("error");
      }
    } catch {
      setErrorMessage("We could not send your message. Please try again.");
      setFormStatus("error");
    }
  }

  return (
    <div className="mt-8 border-t border-ink/15 pt-7">
      <div className="flex flex-wrap items-center gap-5">
        <p className="font-display text-2xl italic tabular-nums text-ink">{formatPrice(price, currency)}</p>
        {formStatus === "idle" && (
          <button
            type="button"
            disabled={!canTransact}
            onClick={() => setFormStatus("open")}
            className="inline-flex min-h-12 items-center bg-ink px-6 py-3 font-body text-[0.68rem] uppercase tracking-[0.16em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            {canTransact ? (isPoa ? "Enquire about this work" : "Buy or enquire") : "Unavailable"}
          </button>
        )}
      </div>

      {(formStatus === "open" || formStatus === "submitting" || formStatus === "error") && (
        <form onSubmit={handleSubmit} className="mt-7 grid max-w-lg gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input id="name" name="name" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input id="email" name="email" type="email" required className={inputClass} />
            </div>
          </div>
          {isPoa && (
            <div>
              <label htmlFor="offer" className={labelClass}>Your offer ({currency}, optional)</label>
              <input id="offer" name="offer" type="number" min="0" step="0.01" className={inputClass + " tabular-nums"} />
            </div>
          )}
          <div>
            <label htmlFor="message" className={labelClass}>Message</label>
            <textarea id="message" name="message" rows={4} className={inputClass} />
          </div>
          {formStatus === "error" && <p role="alert" className="font-body text-sm text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={formStatus === "submitting"} className="inline-flex min-h-12 w-fit items-center bg-ink px-6 py-3 font-body text-[0.68rem] uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink disabled:opacity-50">
            {formStatus === "submitting" ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      )}

      {formStatus === "success" && (
        <p role="status" className="mt-6 max-w-lg border-t border-ink/15 pt-6 font-body text-sm leading-7 text-ink/65">
          Thank you. Your enquiry has been received and the B-Edge team will be in touch by email.
        </p>
      )}
    </div>
  );
}
