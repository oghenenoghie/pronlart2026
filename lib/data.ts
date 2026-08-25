import { sql } from "@/lib/db";
import { MOVEMENTS, getMovementBySlug } from "@/lib/movements";
import type {
  Artist,
  Artwork,
  ArtworkImage,
  ArtworkStatus,
  EnquiryType,
  Medium,
  Movement,
} from "@/types";

/**
 * Data-access seam, backed by Neon Postgres. Pages and components only ever
 * call the functions below — never `lib/db` directly — so the storage layer
 * can change again without touching a single page or component.
 */

export type ArtworkFilters = {
  movement?: string;
  artist?: string;
  status?: ArtworkStatus;
  sort?: "newest" | "price-asc" | "price-desc" | "artist";
};

type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  year: number;
  dimensions: string;
  materials: string;
  description: string;
  price: string | null;
  currency: string;
  edition: string | null;
  status: ArtworkStatus;
  featured: boolean;
  images: ArtworkImage[];
  movement_slug: string;
  artist_id: string;
  artist_slug: string;
  artist_name: string;
  artist_portrait: string | null;
  artist_statement: string | null;
  artist_bio: string | null;
  artist_links: Record<string, string> | null;
  artist_status: "active" | "archived";
  medium_id: string;
  medium_slug: string;
  medium_name: string;
};

function mapArtwork(row: ArtworkRow): Artwork {
  const movement = getMovementBySlug(row.movement_slug);
  if (!movement) throw new Error(`Unknown movement: ${row.movement_slug}`);

  const artist: Artist = {
    id: row.artist_id,
    slug: row.artist_slug,
    name: row.artist_name,
    portrait: row.artist_portrait ?? undefined,
    statement: row.artist_statement ?? undefined,
    bio: row.artist_bio ?? undefined,
    links: row.artist_links ?? undefined,
    status: row.artist_status,
  };

  const medium: Medium = { id: row.medium_id, slug: row.medium_slug, name: row.medium_name };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist,
    movement,
    medium,
    year: row.year,
    dimensions: row.dimensions,
    materials: row.materials,
    description: row.description,
    price: row.price === null ? null : Number(row.price),
    currency: row.currency,
    edition: row.edition ?? undefined,
    status: row.status,
    featured: row.featured,
    images: row.images,
  };
}

const ARTWORK_SELECT = `
  select
    a.id, a.slug, a.title, a.year, a.dimensions, a.materials, a.description,
    a.price, a.currency, a.edition, a.status, a.featured, a.images,
    m.slug as movement_slug,
    ar.id as artist_id, ar.slug as artist_slug, ar.name as artist_name,
    ar.portrait as artist_portrait, ar.statement as artist_statement, ar.bio as artist_bio,
    ar.links as artist_links, ar.status as artist_status,
    md.id as medium_id, md.slug as medium_slug, md.name as medium_name
  from artworks a
  join artists ar on ar.id = a.artist_id
  join movements m on m.id = a.movement_id
  join mediums md on md.id = a.medium_id
`;

const SORT_CLAUSES: Record<NonNullable<ArtworkFilters["sort"]>, string> = {
  newest: "a.year desc",
  "price-asc": "a.price asc nulls last",
  "price-desc": "a.price desc nulls last",
  artist: "ar.name asc",
};

export async function listArtworks(filters: ArtworkFilters = {}): Promise<Artwork[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.movement) {
    params.push(filters.movement);
    conditions.push(`m.slug = $${params.length}`);
  }
  if (filters.artist) {
    params.push(filters.artist);
    conditions.push(`ar.slug = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`a.status = $${params.length}`);
  }

  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";
  const orderBy = SORT_CLAUSES[filters.sort ?? "newest"];

  const rows = (await sql.query(`${ARTWORK_SELECT} ${where} order by ${orderBy}`, params)) as unknown as ArtworkRow[];
  return rows.map(mapArtwork);
}

export async function getArtwork(slug: string): Promise<Artwork | undefined> {
  const rows = (await sql.query(`${ARTWORK_SELECT} where a.slug = $1`, [slug])) as unknown as ArtworkRow[];
  return rows[0] ? mapArtwork(rows[0]) : undefined;
}

export const getArtworkBySlug = getArtwork;

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const rows = (await sql.query(
    `${ARTWORK_SELECT} where a.featured = true order by a.year desc`,
    [],
  )) as unknown as ArtworkRow[];
  return rows.map(mapArtwork);
}

/** One non-featured work to illustrate the home page's sell callout. */
export async function getSellCalloutArtwork(): Promise<Artwork | undefined> {
  const rows = (await sql.query(
    `${ARTWORK_SELECT} order by a.featured asc, a.year desc limit 1`,
    [],
  )) as unknown as ArtworkRow[];
  return rows[0] ? mapArtwork(rows[0]) : undefined;
}

type ArtistRow = {
  id: string;
  slug: string;
  name: string;
  portrait: string | null;
  statement: string | null;
  bio: string | null;
  links: Record<string, string> | null;
  status: "active" | "archived";
};

function mapArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    portrait: row.portrait ?? undefined,
    statement: row.statement ?? undefined,
    bio: row.bio ?? undefined,
    links: row.links ?? undefined,
    status: row.status,
  };
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
  const rows = (await sql`
    select id, slug, name, portrait, statement, bio, links, status
    from artists
    where slug = ${slug}
  `) as unknown as ArtistRow[];
  return rows[0] ? mapArtist(rows[0]) : undefined;
}

export async function getArtistsWithCounts(): Promise<(Artist & { artworkCount: number })[]> {
  const rows = (await sql`
    select ar.id, ar.slug, ar.name, ar.portrait, ar.statement, ar.bio, ar.links, ar.status,
           count(a.id)::int as artwork_count
    from artists ar
    left join artworks a on a.artist_id = ar.id
    group by ar.id
    order by ar.name asc
  `) as unknown as (ArtistRow & { artwork_count: number })[];
  return rows.map((row) => ({ ...mapArtist(row), artworkCount: row.artwork_count }));
}

export async function getMovementsWithCounts(): Promise<(Movement & { artworkCount: number })[]> {
  const rows = (await sql`
    select m.slug, count(a.id)::int as artwork_count
    from movements m
    left join artworks a on a.movement_id = m.id
    group by m.slug
  `) as unknown as { slug: string; artwork_count: number }[];
  const counts = new Map(rows.map((row) => [row.slug, row.artwork_count]));
  return MOVEMENTS.map((movement) => ({ ...movement, artworkCount: counts.get(movement.slug) ?? 0 }));
}

export async function createEnquiry(input: {
  type: EnquiryType;
  artworkId: string;
  name: string;
  email: string;
  message?: string;
  offer?: number;
}): Promise<void> {
  await sql`
    insert into enquiries (type, artwork_id, name, email, message, offer)
    values (${input.type}, ${input.artworkId}, ${input.name}, ${input.email}, ${input.message ?? null}, ${input.offer ?? null})
  `;
}

export async function createSellSubmission(input: {
  artistName: string;
  artistEmail: string;
  title: string;
  movementId: string;
  medium: string;
  dimensions: string;
  askingPrice?: string;
  message?: string;
}): Promise<void> {
  await sql`
    insert into sell_submissions (artist_name, artist_email, title, movement_id, medium, dimensions, asking_price, message)
    values (${input.artistName}, ${input.artistEmail}, ${input.title}, ${input.movementId}, ${input.medium}, ${input.dimensions}, ${input.askingPrice ?? null}, ${input.message ?? null})
  `;
}
