// Supabase Storage render endpoint via next/image's custom loader. Every
// artwork/movement image path stored in the DB is relative to this bucket.
const BUCKET = "artworks";

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/${BUCKET}/${src}?width=${width}&quality=${quality ?? 78}&resize=contain`;
}
