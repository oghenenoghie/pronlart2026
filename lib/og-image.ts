// Plain (non-next/image) Supabase Storage render URL — for contexts that
// need a directly fetchable absolute URL, like OpenGraph/Twitter crawlers,
// rather than next/image's custom-loader src.
const BUCKET = "artworks";

export function supabaseImageUrl(path: string, width = 1200): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/${BUCKET}/${path}?width=${width}&quality=80&resize=contain`;
}
