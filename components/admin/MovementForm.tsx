"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { fieldLabel, fieldInput, submitButton } from "@/components/admin/form-styles";
import type { Movement } from "@/types";

export function MovementForm({
  action,
  movement,
}: {
  action: (formData: FormData) => void | Promise<void>;
  movement: Movement;
}) {
  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <div>
        <p className={fieldLabel}>Name</p>
        <p className="mt-2 font-display text-lg italic text-gesso">{movement.name}</p>
      </div>

      <div>
        <label htmlFor="era" className={fieldLabel}>
          Era
        </label>
        <input id="era" name="era" defaultValue={movement.era} required className={fieldInput} />
      </div>

      <div>
        <label htmlFor="summary" className={fieldLabel}>
          Summary (one line)
        </label>
        <input id="summary" name="summary" defaultValue={movement.summary} required className={fieldInput} />
      </div>

      <div>
        <label htmlFor="blurb" className={fieldLabel}>
          Blurb (full essay)
        </label>
        <textarea id="blurb" name="blurb" rows={6} defaultValue={movement.blurb} required className={fieldInput} />
      </div>

      <div className="border-t border-line pt-6">
        <ImageUploadField
          name="heroImagePath"
          pathPrefix="admin-uploads/movements"
          label="Hero image"
          initialPath={movement.heroImage}
        />
      </div>

      <button type="submit" className={submitButton}>
        Save changes
      </button>
    </form>
  );
}
