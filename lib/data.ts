import type { Artist, Artwork, ArtworkImage, ArtworkStatus, Medium, Movement } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

/**
 * Data-access seam — everything here reads live from Supabase.
 */

type MovementRow = Database["public"]["Tables"]["movements"]["Row"];
type ArtistRow = Database["public"]["Tables"]["artists"]["Row"];
type MediumRow = Database["public"]["Tables"]["mediums"]["Row"];
type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"];
type ArtworkJoinRow = ArtworkRow & { artist: ArtistRow; movement: MovementRow; medium: MediumRow };

function toMovement(row: MovementRow): Movement {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    era: row.era,
    summary: row.summary,
    blurb: row.blurb,
    heroImage: row.hero_image ?? undefined,
    sort: row.sort,
  };
}

export async function listMovements(): Promise<Movement[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("movements").select("*").order("sort", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toMovement);
}

export async function getMovement(slug: string): Promise<Movement | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("movements").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toMovement(data) : undefined;
}

export async function getMovementById(id: string): Promise<Movement | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("movements").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toMovement(data) : undefined;
}

export type MovementWithCount = Movement & { artworkCount: number };

export async function listMovementsWithCounts(): Promise<MovementWithCount[]> {
  const supabase = createClient();
  const [movements, { data: rows, error }] = await Promise.all([
    listMovements(),
    supabase.from("artworks").select("movement_id").returns<{ movement_id: string }[]>(),
  ]);
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    counts.set(row.movement_id, (counts.get(row.movement_id) ?? 0) + 1);
  }
  return movements.map((movement) => ({
    ...movement,
    artworkCount: counts.get(movement.id) ?? 0,
  }));
}

function toArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    portrait: row.portrait ?? undefined,
    statement: row.statement ?? undefined,
    bio: row.bio ?? undefined,
    links: (row.links as Record<string, string>) ?? undefined,
    status: row.status,
  };
}

export async function listArtists(): Promise<Artist[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("artists").select("*").order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toArtist);
}

export async function getArtist(slug: string): Promise<Artist | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("artists").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toArtist(data) : undefined;
}

export async function getArtistById(id: string): Promise<Artist | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("artists").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toArtist(data) : undefined;
}

export type ArtistWithCount = Artist & { artworkCount: number };

export async function listArtistsWithCounts(): Promise<ArtistWithCount[]> {
  const supabase = createClient();
  const [artists, { data: rows, error }] = await Promise.all([
    listArtists(),
    supabase.from("artworks").select("artist_id").returns<{ artist_id: string }[]>(),
  ]);
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    counts.set(row.artist_id, (counts.get(row.artist_id) ?? 0) + 1);
  }
  return artists.map((artist) => ({
    ...artist,
    artworkCount: counts.get(artist.id) ?? 0,
  }));
}

function toMedium(row: MediumRow): Medium {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
  };
}

export async function listMediums(): Promise<Medium[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("mediums").select("*").order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toMedium);
}

export async function getMedium(slug: string): Promise<Medium | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("mediums").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toMedium(data) : undefined;
}

export async function getMediumById(id: string): Promise<Medium | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase.from("mediums").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toMedium(data) : undefined;
}

export type ArtworkFilters = {
  movement?: string;
  artist?: string;
  status?: ArtworkStatus;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "artist";
};

const ARTWORK_JOIN_SELECT = "*, artist:artists!inner(*), movement:movements!inner(*), medium:mediums!inner(*)";

function toArtwork(row: ArtworkJoinRow): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist: toArtist(row.artist),
    movement: toMovement(row.movement),
    medium: toMedium(row.medium),
    year: row.year,
    dimensions: row.dimensions,
    materials: row.materials,
    description: row.description,
    price: row.price,
    currency: row.currency,
    edition: row.edition ?? undefined,
    status: row.status,
    images: row.images as unknown as ArtworkImage[],
    featured: row.featured,
  };
}

export async function listArtworks(filters: ArtworkFilters = {}): Promise<Artwork[]> {
  const supabase = createClient();
  let query = supabase.from("artworks").select(ARTWORK_JOIN_SELECT);

  if (filters.movement) query = query.eq("movement.slug", filters.movement);
  if (filters.artist) query = query.eq("artist.slug", filters.artist);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.featured !== undefined) query = query.eq("featured", filters.featured);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    case "artist":
      query = query.order("name", { ascending: true, foreignTable: "artist" });
      break;
    case "newest":
    default:
      query = query.order("year", { ascending: false });
  }

  const { data, error } = await query.returns<ArtworkJoinRow[]>();
  if (error) throw error;
  return (data ?? []).map(toArtwork);
}

export async function getArtwork(slug: string): Promise<Artwork | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_JOIN_SELECT)
    .eq("slug", slug)
    .maybeSingle()
    .returns<ArtworkJoinRow>();
  if (error) throw error;
  return data ? toArtwork(data) : undefined;
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_JOIN_SELECT)
    .eq("id", id)
    .maybeSingle()
    .returns<ArtworkJoinRow>();
  if (error) throw error;
  return data ? toArtwork(data) : undefined;
}

// Enquiries ---------------------------------------------------------------

type EnquiryRow = Database["public"]["Tables"]["enquiries"]["Row"];
export type EnquiryWithArtwork = EnquiryRow & { artwork: { slug: string; title: string } | null };

export async function createEnquiry(input: {
  type: "purchase" | "enquiry";
  artworkId: string;
  name: string;
  email: string;
  message?: string;
  offer?: number;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("enquiries").insert({
    type: input.type,
    artwork_id: input.artworkId,
    name: input.name,
    email: input.email,
    message: input.message || null,
    offer: input.offer ?? null,
  });
  if (error) throw error;
}

export async function listEnquiries(): Promise<EnquiryWithArtwork[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, artwork:artworks(slug, title)")
    .order("created_at", { ascending: false })
    .returns<EnquiryWithArtwork[]>();
  if (error) throw error;
  return data ?? [];
}

export async function updateEnquiryStatus(id: string, status: Database["public"]["Enums"]["enquiry_status"]) {
  const supabase = createClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

// Sell submissions ---------------------------------------------------------------

type SellSubmissionRow = Database["public"]["Tables"]["sell_submissions"]["Row"];
export type SellSubmissionWithTaxonomy = SellSubmissionRow & {
  movement: { name: string } | null;
  medium: { name: string } | null;
};

export async function createSellSubmission(input: {
  artistName: string;
  artistEmail: string;
  title: string;
  movementId: string;
  mediumId: string;
  dimensions: string;
  askingPrice?: number;
  currency?: string;
  message?: string;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("sell_submissions").insert({
    artist_name: input.artistName,
    artist_email: input.artistEmail,
    title: input.title,
    movement_id: input.movementId,
    medium_id: input.mediumId,
    dimensions: input.dimensions,
    asking_price: input.askingPrice ?? null,
    currency: input.currency ?? "NGN",
    message: input.message || null,
  });
  if (error) throw error;
}

export async function listSellSubmissions(): Promise<SellSubmissionWithTaxonomy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sell_submissions")
    .select("*, movement:movements(name), medium:mediums(name)")
    .order("created_at", { ascending: false })
    .returns<SellSubmissionWithTaxonomy[]>();
  if (error) throw error;
  return data ?? [];
}

export async function updateSellSubmissionStatus(
  id: string,
  status: Database["public"]["Enums"]["sell_submission_status"]
) {
  const supabase = createClient();
  const { error } = await supabase.from("sell_submissions").update({ status }).eq("id", id);
  if (error) throw error;
}
