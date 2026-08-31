"use client";

import { useId, useState, type ChangeEvent } from "react";

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

/**
 * Uploads the raw file to /api/media/upload (see that route, which gates
 * on an admin session and stores the bytes directly in Neon Postgres) and
 * exposes the resulting serving path (/api/images/{id}) plus probed
 * width/height as hidden inputs so a normal form submission / Server
 * Action picks them up like any other field.
 */
export function ImageUploadField({
  name,
  label,
  initialPath,
  initialWidth,
  initialHeight,
}: {
  name: string;
  label: string;
  initialPath?: string | null;
  initialWidth?: number | null;
  initialHeight?: number | null;
}) {
  const inputId = useId();
  const [path, setPath] = useState(initialPath ?? "");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(
    initialWidth && initialHeight ? { width: initialWidth, height: initialHeight } : null
  );
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      const dims = await readImageDimensions(file);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
          "X-Image-Width": String(dims.width),
          "X-Image-Height": String(dims.height),
        },
        body: file,
      });

      const body = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !body.id) {
        throw new Error(body.error ?? "Upload failed.");
      }

      setDimensions(dims);
      setPath(`/api/images/${body.id}`);
      setStatus("idle");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="font-body text-label uppercase tracking-[0.18em] text-ash">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={status === "uploading"}
        className="mt-2 block w-full font-body text-sm text-ash file:mr-4 file:border file:border-line file:bg-ink file:px-3 file:py-1.5 file:font-body file:text-sm file:text-gesso"
      />
      {status === "uploading" && <p className="mt-2 font-body text-sm text-ash">Uploading…</p>}
      {status === "error" && <p className="mt-2 font-body text-sm text-red-400">{error}</p>}
      {path && status !== "uploading" && <p className="mt-2 truncate font-body text-sm text-ash">{path}</p>}

      <input type="hidden" name={name} value={path} />
      <input type="hidden" name={`${name}Width`} value={dimensions?.width ?? ""} />
      <input type="hidden" name={`${name}Height`} value={dimensions?.height ?? ""} />
    </div>
  );
}
