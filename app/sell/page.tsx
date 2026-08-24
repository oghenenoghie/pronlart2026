import type { Metadata } from "next";
import { SellForm } from "@/components/forms/SellForm";
import { listMediums, listMovements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sell",
  description: "Submit a work to be considered for the gallery.",
};

export default async function SellPage() {
  const [movements, mediums] = await Promise.all([listMovements(), listMediums()]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-display-lg italic text-gesso">Sell a work</h1>
      <p className="mt-3 max-w-xl font-body text-lede text-ash">
        Submit an original work for consideration. We review every submission and follow up by email.
      </p>

      <SellForm movements={movements} mediums={mediums} />
    </div>
  );
}
