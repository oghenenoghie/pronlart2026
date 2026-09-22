"use client";

import { RouteError } from "@/components/common/RouteError";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError message="The archive couldn't be loaded." reset={reset} />;
}
