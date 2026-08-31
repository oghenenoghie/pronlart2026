"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { fieldLabel, fieldInput, submitButton } from "@/components/admin/form-styles";
import { toMajorUnitsString } from "@/lib/money";
import type { Artist, Artwork, ArtworkStatus, Medium, Movement } from "@/types";

const STATUSES: ArtworkStatus[] = ["available", "reserved", "sold"];

export function ArtworkForm({
  action,
  artwork,
  artists,
  movements,
  mediums,
}: {
  action: (formData: FormData) => void | Promise<void>;
  artwork?: Artwork;
  artists: Artist[];
  movements: Movement[];
  mediums: Medium[];
}) {
  const primaryImage = artwork?.images.find((img) => img.isPrimary) ?? artwork?.images[0];
  const [priceOnRequest, setPriceOnRequest] = useState(artwork ? artwork.price === null : false);

  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <div>
        <label htmlFor="title" className={fieldLabel}>
          Title
        </label>
        <input id="title" name="title" defaultValue={artwork?.title} required className={fieldInput} />
      </div>

      <div>
        <label htmlFor="slug" className={fieldLabel}>
          Slug (optional — derived from title if left blank)
        </label>
        <input id="slug" name="slug" defaultValue={artwork?.slug} className={fieldInput} />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="artistId" className={fieldLabel}>
            Artist
          </label>
          <select id="artistId" name="artistId" defaultValue={artwork?.artist.id ?? ""} required className={fieldInput}>
            <option value="" disabled>
              Select
            </option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="movementId" className={fieldLabel}>
            Movement
          </label>
          <select
            id="movementId"
            name="movementId"
            defaultValue={artwork?.movement.id ?? ""}
            required
            className={fieldInput}
          >
            <option value="" disabled>
              Select
            </option>
            {movements.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mediumId" className={fieldLabel}>
            Medium
          </label>
          <select id="mediumId" name="mediumId" defaultValue={artwork?.medium.id ?? ""} required className={fieldInput}>
            <option value="" disabled>
              Select
            </option>
            {mediums.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="year" className={fieldLabel}>
            Year
          </label>
          <input id="year" name="year" type="number" defaultValue={artwork?.year} required className={fieldInput} />
        </div>
        <div>
          <label htmlFor="edition" className={fieldLabel}>
            Edition (optional)
          </label>
          <input id="edition" name="edition" defaultValue={artwork?.edition} className={fieldInput} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dimensions" className={fieldLabel}>
            Dimensions
          </label>
          <input
            id="dimensions"
            name="dimensions"
            defaultValue={artwork?.dimensions}
            required
            className={fieldInput}
          />
        </div>
        <div>
          <label htmlFor="materials" className={fieldLabel}>
            Materials
          </label>
          <input id="materials" name="materials" defaultValue={artwork?.materials} required className={fieldInput} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={fieldLabel}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={artwork?.description}
          className={fieldInput}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className={fieldLabel}>
            Price (major units, e.g. 850000.00)
          </label>
          <input
            id="price"
            name="price"
            defaultValue={artwork && artwork.price !== null ? toMajorUnitsString(artwork.price, artwork.currency) : ""}
            disabled={priceOnRequest}
            placeholder="Leave blank for price on request"
            className={fieldInput}
          />
          <label className="mt-2 flex items-center gap-2 font-body text-sm text-ash">
            <input type="checkbox" checked={priceOnRequest} onChange={(e) => setPriceOnRequest(e.target.checked)} />
            Price on request
          </label>
        </div>
        <div>
          <label htmlFor="currency" className={fieldLabel}>
            Currency
          </label>
          <input id="currency" name="currency" defaultValue={artwork?.currency ?? "NGN"} required className={fieldInput} />
        </div>
        <div>
          <label htmlFor="status" className={fieldLabel}>
            Status
          </label>
          <select id="status" name="status" defaultValue={artwork?.status ?? "available"} required className={fieldInput}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 font-body text-sm text-ash">
        <input type="checkbox" name="featured" defaultChecked={artwork?.featured} />
        Featured on the home page exhibition
      </label>

      <div className="border-t border-line pt-6">
        <ImageUploadField
          name="imagePath"
          label="Primary image"
          initialPath={primaryImage?.path}
          initialWidth={primaryImage?.width}
          initialHeight={primaryImage?.height}
        />
        <div className="mt-4">
          <label htmlFor="imageAlt" className={fieldLabel}>
            Image alt text
          </label>
          <input id="imageAlt" name="imageAlt" defaultValue={primaryImage?.alt} className={fieldInput} />
        </div>
      </div>

      <button type="submit" className={submitButton}>
        {artwork ? "Save changes" : "Create artwork"}
      </button>
    </form>
  );
}
