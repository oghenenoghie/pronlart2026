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
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Accordion type="multiple" defaultValue={["movement", "availability"]} className="w-full">
      <AccordionItem value="movement">
        <AccordionTrigger>Movement</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-3">
            {movements.map((movement) => (
              <li key={movement.slug}>
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={activeMovement === movement.slug}
                    onCheckedChange={() => toggleParam("movement", movement.slug)}
                  />
                  <span className="font-body text-sm text-gesso">{movement.name}</span>
                  <span className="font-body text-sm tabular-nums text-ash">{movement.artworkCount}</span>
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="availability">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-3">
            {STATUSES.map((status) => (
              <li key={status.value}>
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={activeStatus === status.value}
                    onCheckedChange={() => toggleParam("status", status.value)}
                  />
                  <span className="font-body text-sm text-gesso">{status.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
