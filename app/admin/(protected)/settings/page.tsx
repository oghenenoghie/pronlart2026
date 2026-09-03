import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSellCalloutImage } from "@/lib/data";
import { updateSellCalloutImage } from "./actions";

export default async function SettingsPage() {
  const sellCalloutImage = await getSellCalloutImage();

  return (
    <div>
      <h1 className="font-display text-h2 italic text-gesso">Home page</h1>
      <div className="mt-8">
        <SiteSettingsForm action={updateSellCalloutImage} sellCalloutImage={sellCalloutImage} />
      </div>
    </div>
  );
}
