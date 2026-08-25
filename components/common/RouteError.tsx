"use client";

import { Button } from "@/components/ui/button";

/** Shared body for every route segment's error.tsx — Next.js requires the file itself to live per-route. */
export function RouteError({ message, reset }: { message: string; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24">
      <p className="font-body text-ash">{message}</p>
      <Button variant="quiet" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
