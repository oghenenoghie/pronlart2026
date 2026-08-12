import type { Artwork } from "@/types";

/**
 * Placeholder canvas until the Supabase Storage media pipeline (build order
 * step 3) is wired up — a muted, deterministic wash standing in for the
 * artwork photograph, so layout and aspect ratio are correct from day one.
 */
function hueFor(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

export function ArtworkImage({ artwork, className }: { artwork: Artwork; className?: string }) {
  const primary = artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];
  const hue = hueFor(artwork.id);
  const ratio = primary ? `${primary.width} / ${primary.height}` : "4 / 5";

  return (
    <div
      className={className}
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(155deg, hsl(${hue} 22% 14%), hsl(${hue} 14% 7%))`,
      }}
      role="img"
      aria-label={primary?.alt ?? artwork.title}
    />
  );
}
