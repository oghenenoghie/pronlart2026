"use client";

import { useState, type FormEvent } from "react";
import type { Movement } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

export function SellForm({ movements }: { movements: Movement[] }) {
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
          <label htmlFor="artistName" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Your name
          </label>
          <input
            id="artistName"
            name="artistName"
            type="text"
            required
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="artistEmail" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Email
          </label>
          <input
            id="artistEmail"
            name="artistEmail"
            type="email"
            required
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="font-body text-label uppercase tracking-[0.18em] text-ash">
          Work title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="movement" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Movement
          </label>
          <select
            id="movement"
            name="movement"
            required
            defaultValue=""
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
          >
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
          <label htmlFor="medium" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Medium
          </label>
          <input
            id="medium"
            name="medium"
            type="text"
            required
            placeholder="e.g. Oil on canvas"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso placeholder:text-ash/60 focus:border-gilt focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dimensions" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Dimensions
          </label>
          <input
            id="dimensions"
            name="dimensions"
            type="text"
            required
            placeholder="e.g. 120 × 90 cm"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso placeholder:text-ash/60 focus:border-gilt focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="askingPrice" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Asking price (optional)
          </label>
          <input
            id="askingPrice"
            name="askingPrice"
            type="text"
            placeholder="Leave blank for price on request"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso placeholder:text-ash/60 focus:border-gilt focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-body text-label uppercase tracking-[0.18em] text-ash">
          Anything else
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
        />
      </div>

      <p className="font-body text-sm text-ash">
        Image upload isn&apos;t connected yet — once you submit, we&apos;ll follow up by email for photos.
      </p>

      {status === "error" && <p className="font-body text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
