"use client";

import { fieldLabel, fieldInput, submitButton } from "@/components/admin/form-styles";
import type { Medium } from "@/types";

export function MediumForm({
  action,
  medium,
}: {
  action: (formData: FormData) => void | Promise<void>;
  medium?: Medium;
}) {
  return (
    <form action={action} className="grid max-w-md gap-6">
      <div>
        <label htmlFor="name" className={fieldLabel}>
          Name
        </label>
        <input id="name" name="name" defaultValue={medium?.name} required className={fieldInput} />
      </div>

      <div>
        <label htmlFor="slug" className={fieldLabel}>
          Slug (optional — derived from name if left blank)
        </label>
        <input id="slug" name="slug" defaultValue={medium?.slug} className={fieldInput} />
      </div>

      <button type="submit" className={submitButton}>
        {medium ? "Save changes" : "Create medium"}
      </button>
    </form>
  );
}
