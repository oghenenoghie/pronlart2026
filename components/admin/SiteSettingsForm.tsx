"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { fieldLabel, fieldInput, submitButton } from "@/components/admin/form-styles";
import type { SiteImage } from "@/types";

export function SiteSettingsForm({
  action,
  sellCalloutImage,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sellCalloutImage?: SiteImage;
}) {
  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <div>
        <p className={fieldLabel}>Sell pitch image</p>
        <p className="mt-2 max-w-md font-body text-sm text-ash">
          The image shown next to &ldquo;How Do I Get My Work Shown?&rdquo; on the home page, right
          after the hero.
        </p>
      </div>

      <ImageUploadField
        name="sellImagePath"
        label="Image"
        initialPath={sellCalloutImage?.path}
        initialWidth={sellCalloutImage?.width}
        initialHeight={sellCalloutImage?.height}
      />

      <div>
        <label htmlFor="sellImageAlt" className={fieldLabel}>
          Image alt text
        </label>
        <input
          id="sellImageAlt"
          name="sellImageAlt"
          defaultValue={sellCalloutImage?.alt}
          className={fieldInput}
        />
      </div>

      <button type="submit" className={submitButton}>
        Save changes
      </button>
    </form>
  );
}
