"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, fieldLabelClass } from "@/lib/utils";
import type { Medium, Movement } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

export function SellForm({ movements, mediums }: { movements: Movement[]; mediums: Medium[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/sell-submit", {
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

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      const body = await res.json().catch(() => null);
      setErrorMessage(body?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-12 max-w-md border-t border-line pt-8 font-body text-ash">
        Thank you — we&apos;ll review your submission and be in touch by email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 grid max-w-xl gap-6 border-t border-line pt-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="artistName" className={fieldLabelClass}>
            Your name
          </label>
          <input id="artistName" name="artistName" type="text" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="artistEmail" className={fieldLabelClass}>
            Email
          </label>
          <input id="artistEmail" name="artistEmail" type="email" required className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={fieldLabelClass}>
          Work title
        </label>
        <input id="title" name="title" type="text" required className={fieldClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="movement" className={fieldLabelClass}>
            Movement
          </label>
          <select id="movement" name="movement" required defaultValue="" className={fieldClass}>
            <option value="" disabled className="bg-ink text-ash">
              Select a movement
            </option>
            {movements.map((movement) => (
              <option key={movement.slug} value={movement.slug} className="bg-ink text-gesso">
                {movement.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="medium" className={fieldLabelClass}>
            Medium
          </label>
          <select id="medium" name="medium" required defaultValue="" className={fieldClass}>
            <option value="" disabled className="bg-ink text-ash">
              Select a medium
            </option>
            {mediums.map((medium) => (
              <option key={medium.slug} value={medium.slug} className="bg-ink text-gesso">
                {medium.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dimensions" className={fieldLabelClass}>
            Dimensions
          </label>
          <input
            id="dimensions"
            name="dimensions"
            type="text"
            required
            placeholder="e.g. 120 × 90 cm"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="askingPrice" className={fieldLabelClass}>
            Asking price (optional)
          </label>
          <input
            id="askingPrice"
            name="askingPrice"
            type="text"
            placeholder="Leave blank for price on request"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={fieldLabelClass}>
          Anything else
        </label>
        <textarea id="message" name="message" rows={4} className={fieldClass} />
      </div>

      <p className="font-body text-sm text-ash">
        Image upload isn&apos;t connected yet — once you submit, we&apos;ll follow up by email for photos.
      </p>

      {status === "error" && <p className="font-body text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
