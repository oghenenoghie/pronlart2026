"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import type { ArtworkStatus } from "@/types";

const STATUSES: { value: ArtworkStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

export function FacetRail({
  movements,
}: {
  movements: { slug: string; name: string; artworkCount: number }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMovement = searchParams.get("movement");
  const activeStatus = searchParams.get("status");

  function toggleParam(key: "movement" | "status", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    const query = params.toString();
    router.push(query ? pathname + "?" + query : pathname, { scroll: false });
  }

  return (
    <div className="border-y border-ink/15">
      <Accordion type="multiple" defaultValue={["movement", "availability"]} className="w-full">
        <AccordionItem value="movement" className="border-ink/10">
          <AccordionTrigger className="text-ink hover:text-ink">Movement</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {movements.map((movement) => (
                <li key={movement.slug}>
                  <label className="flex cursor-pointer items-center gap-3">
                    <Checkbox
                      className="border-ink/25 data-[state=checked]:border-gilt data-[state=checked]:bg-gilt"
                      checked={activeMovement === movement.slug}
                      onCheckedChange={() => toggleParam("movement", movement.slug)}
                    />
                    <span className="flex-1 font-body text-sm text-ink/70">{movement.name}</span>
                    <span className="font-body text-xs tabular-nums text-ink/40">{movement.artworkCount}</span>
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="availability" className="border-ink/10">
          <AccordionTrigger className="text-ink hover:text-ink">Availability</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {STATUSES.map((status) => (
                <li key={status.value}>
                  <label className="flex cursor-pointer items-center gap-3">
                    <Checkbox
                      className="border-ink/25 data-[state=checked]:border-gilt data-[state=checked]:bg-gilt"
                      checked={activeStatus === status.value}
                      onCheckedChange={() => toggleParam("status", status.value)}
                    />
                    <span className="font-body text-sm text-ink/70">{status.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
