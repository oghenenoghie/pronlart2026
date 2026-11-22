"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";
const inputClass = "mt-2 w-full border border-ink/15 bg-white px-3 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-gilt focus:outline-none focus:ring-1 focus:ring-gilt";
const labelClass = "font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink/55";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
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
      setErrorMessage("We could not send your message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="mt-8 max-w-lg border-t border-ink/15 pt-7 font-body text-base leading-7 text-ink/65">
        Thank you. Your message has been received and we will be in touch by email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid max-w-xl gap-5 border-t border-ink/15 pt-8">
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
      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea id="message" name="message" rows={5} required className={inputClass} />
      </div>
      {status === "error" && <p role="alert" className="font-body text-sm text-red-700">{errorMessage}</p>}
      <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 w-fit items-center bg-ink px-6 py-3 font-body text-[0.68rem] uppercase tracking-[0.16em] text-gesso transition-colors hover:bg-gilt hover:text-ink disabled:opacity-50">
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
