import Image from "next/image";
import type { Artwork } from "@/types";

export function ArtworkImage({
  artwork,
  className,
  priority,
}: {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
}) {
  const primary = artwork.images.find((img) => img.isPrimary) ?? artwork.images[0];

  if (!primary) {
    return (
      <div
        className={className}
        style={{ aspectRatio: "4 / 5", background: "hsl(40 8% 10%)" }}
        role="img"
        aria-label={artwork.title}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ position: "relative", overflow: "hidden", aspectRatio: `${primary.width} / ${primary.height}` }}
    >
      <Image
        src={primary.path}
        alt={primary.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
