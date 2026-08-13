"use client";

import { useState, type FormEvent } from "react";
import { formatPrice, parseToMinorUnits } from "@/lib/money";
import type { ArtworkStatus } from "@/types";

type Status = "idle" | "open" | "submitting" | "success" | "error";

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const offerRaw = data.get("offer");

    const res = await fetch("/api/enquiry", {
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

    if (res.ok) {
      setFormStatus("success");
    } else {
      const body = await res.json().catch(() => null);
      setErrorMessage(body?.error ?? "Something went wrong. Please try again.");
      setFormStatus("error");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-6">
        <p className="font-body text-lg font-medium text-gesso">{formatPrice(price, currency)}</p>
        {formStatus === "idle" && (
          <button
            type="button"
            disabled={!canTransact}
            onClick={() => setFormStatus("open")}
            className="border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:text-ash disabled:hover:bg-transparent"
          >
            {canTransact ? (isPoa ? "Enquire" : "Buy or enquire") : "Unavailable"}
          </button>
        )}
      </div>

      {(formStatus === "open" || formStatus === "submitting" || formStatus === "error") && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-sm space-y-4 border-t border-line pt-6">
          <div>
            <label htmlFor="name" className="font-body text-label uppercase tracking-[0.18em] text-ash">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-body text-label uppercase tracking-[0.18em] text-ash">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
            />
          </div>
          {isPoa && (
            <div>
              <label htmlFor="offer" className="font-body text-label uppercase tracking-[0.18em] text-ash">
                Your offer ({currency}, optional)
              </label>
              <input
                id="offer"
                name="offer"
                type="number"
                min="0"
                step="0.01"
                className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso tabular-nums focus:border-gilt focus:outline-none"
              />
            </div>
          )}
          <div>
            <label htmlFor="message" className="font-body text-label uppercase tracking-[0.18em] text-ash">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
            />
          </div>

          {formStatus === "error" && <p className="font-body text-sm text-red-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={formStatus === "submitting"}
            className="border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formStatus === "submitting" ? "Sending…" : "Send"}
          </button>
        </form>
      )}

      {formStatus === "success" && (
        <p className="mt-6 border-t border-line pt-6 font-body text-sm text-ash">
          Thank you — we&apos;ll be in touch by email shortly.
        </p>
      )}
    </div>
  );
}
