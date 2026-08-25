"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice, parseToMinorUnits } from "@/lib/money";
import { fieldClass, fieldLabelClass } from "@/lib/utils";
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
          <Button type="button" disabled={!canTransact} onClick={() => setFormStatus("open")}>
            {canTransact ? (isPoa ? "Enquire" : "Buy or enquire") : "Unavailable"}
          </Button>
        )}
      </div>

      {(formStatus === "open" || formStatus === "submitting" || formStatus === "error") && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-sm space-y-4 border-t border-line pt-6">
          <div>
            <label htmlFor="name" className={fieldLabelClass}>
              Name
            </label>
            <input id="name" name="name" type="text" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="email" className={fieldLabelClass}>
              Email
            </label>
            <input id="email" name="email" type="email" required className={fieldClass} />
          </div>
          {isPoa && (
            <div>
              <label htmlFor="offer" className={fieldLabelClass}>
                Your offer ({currency}, optional)
              </label>
              <input id="offer" name="offer" type="number" min="0" step="0.01" className={`${fieldClass} tabular-nums`} />
            </div>
          )}
          <div>
            <label htmlFor="message" className={fieldLabelClass}>
              Message
            </label>
            <textarea id="message" name="message" rows={3} className={fieldClass} />
          </div>

          {formStatus === "error" && <p className="font-body text-sm text-red-400">{errorMessage}</p>}

          <Button type="submit" disabled={formStatus === "submitting"}>
            {formStatus === "submitting" ? "Sending…" : "Send"}
          </Button>
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
