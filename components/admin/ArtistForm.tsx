"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { fieldLabel, fieldInput, submitButton } from "@/components/admin/form-styles";
import type { Artist } from "@/types";

export function ArtistForm({
  action,
  artist,
}: {
  action: (formData: FormData) => void | Promise<void>;
  artist?: Artist;
}) {
  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <div>
        <label htmlFor="name" className={fieldLabel}>
          Name
        </label>
        <input id="name" name="name" defaultValue={artist?.name} required className={fieldInput} />
      </div>

      <div>
        <label htmlFor="slug" className={fieldLabel}>
          Slug (optional — derived from name if left blank)
        </label>
        <input id="slug" name="slug" defaultValue={artist?.slug} className={fieldInput} />
      </div>

      <div>
        <label htmlFor="statement" className={fieldLabel}>
          Statement
        </label>
        <input id="statement" name="statement" defaultValue={artist?.statement} className={fieldInput} />
      </div>

      <div>
        <label htmlFor="bio" className={fieldLabel}>
          Bio
        </label>
        <textarea id="bio" name="bio" rows={5} defaultValue={artist?.bio} className={fieldInput} />
      </div>

      <div>
        <label htmlFor="status" className={fieldLabel}>
          Status
        </label>
        <select id="status" name="status" defaultValue={artist?.status ?? "active"} required className={fieldInput}>
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <div className="border-t border-line pt-6">
        <ImageUploadField name="portraitPath" label="Portrait" initialPath={artist?.portrait} />
      </div>

      <button type="submit" className={submitButton}>
        {artist ? "Save changes" : "Create artist"}
      </button>
    </form>
  );
}
