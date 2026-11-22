"use client";

import { useState, type FormEvent } from "react";
import type { Medium, Movement } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";
const inputClass = "mt-2 w-full border border-ink/15 bg-white px-3 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-gilt focus:outline-none focus:ring-1 focus:ring-gilt";
const labelClass = "font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/55";

export function SellForm({ movements, mediums }: { movements: Movement[]; mediums: Medium[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/sell-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName: data.get("artistName"),
          artistEmail: data.get("artistEmail"),
          title: data.get("title"),
          movement: data.get("movement"),
          medium: data.get("medium"),
          dimensions: data.get("dimensions"),
          askingPrice: data.get("askingPrice"),
          message: data.get("message"),
        }),
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const body = await response.json().catch(() => null);
        setErrorMessage(body?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("We could not send your submission. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="mt-8 border-t border-ink/15 pt-8">
        <p className="font-display text-2xl italic text-ink">Thank you for sharing your work.</p>
        <p className="mt-3 max-w-lg font-body text-sm leading-7 text-ink/60">Your submission has been received. Our team will review the details and contact you by email about the next steps, including artwork photographs.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 border-t border-ink/15 pt-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="artistName" className={labelClass}>Your name</label>
          <input id="artistName" name="artistName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="artistEmail" className={labelClass}>Email address</label>
          <input id="artistEmail" name="artistEmail" type="email" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>Work title</label>
        <input id="title" name="title" type="text" required className={inputClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="movement" className={labelClass}>Movement</label>
          <select id="movement" name="movement" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select a movement</option>
            {movements.map((movement) => (
              <option key={movement.slug} value={movement.slug}>{movement.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="medium" className={labelClass}>Medium</label>
          <select id="medium" name="medium" required defaultValue="" className={inputClass}>
            <option value="" disabled>Select a medium</option>
            {mediums.map((medium) => (
              <option key={medium.slug} value={medium.slug}>{medium.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dimensions" className={labelClass}>Dimensions</label>
          <input id="dimensions" name="dimensions" type="text" required placeholder="e.g. 120 × 90 cm" className={inputClass} />
        </div>
        <div>
          <label htmlFor="askingPrice" className={labelClass}>Asking price (optional)</label>
          <input id="askingPrice" name="askingPrice" type="text" placeholder="Leave blank for price on request" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Tell us about the work (optional)</label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </div>

      <div className="border border-ink/10 bg-white p-4">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/55">Artwork photographs</p>
        <p className="mt-2 font-body text-sm leading-6 text-ink/60">
          Photograph upload is not yet available in this form. After reviewing your submission, our team will contact you by email to request images of the work.
        </p>
      </div>

      {status === "error" && <p role="alert" className="font-body text-sm text-red-700">{errorMessage}</p>}
      <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 w-fit items-center bg-ink px-6 py-3 font-body text-[0.68rem] uppercase tracking-[0.16em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:opacity-50">
        {status === "submitting" ? "Sending…" : "Submit for consideration"}
      </button>
    </form>
  );
}
