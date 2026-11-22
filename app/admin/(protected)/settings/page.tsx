import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSellCalloutImage } from "@/lib/data";
import { updateSellCalloutImage } from "./actions";

export default async function SettingsPage() {
  const sellCalloutImage = await getSellCalloutImage();

  return (
    <div>
      <p className="mb-3 font-body text-[0.66rem] uppercase tracking-[0.18em] text-ink/45">Site presentation</p>
      <h1>Home page settings</h1>
      <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-ink/60">
        Manage the image used in the home page invitation for artists to submit their work. The rest of the home page content is managed from the catalogue.
      </p>
      <div className="mt-8">
        <SiteSettingsForm action={updateSellCalloutImage} sellCalloutImage={sellCalloutImage} />
      </div>
    </div>
  );
}
