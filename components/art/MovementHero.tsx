import Image from "next/image";

export function MovementHero({ path, alt }: { path: string; alt: string }) {
  return (
    <div className="relative mb-12 aspect-[21/9] overflow-hidden border border-line">
      <Image
        src={path}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 1152px, 100vw"
        priority
        className="object-cover"
      />
    </div>
  );
}
