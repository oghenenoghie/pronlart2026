"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, fieldLabelClass } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
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
      <p className="mt-10 max-w-md border-t border-line pt-8 font-body text-ash">
        Thank you — we&apos;ll be in touch by email shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid max-w-md gap-6 border-t border-line pt-8">
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
      <div>
        <label htmlFor="message" className={fieldLabelClass}>
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className={fieldClass} />
      </div>

      {status === "error" && <p className="font-body text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
