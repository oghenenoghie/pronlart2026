import { cache } from "react";
import { sql } from "@/lib/db";
import type { Artist, Artwork, ArtworkImage, ArtworkStatus, Medium, Movement } from "@/types";

/**
 * Data-access seam, backed by Neon Postgres. Pages and components only ever
 * call the functions below — never `lib/db` directly.
 */

// Movements -----------------------------------------------------------------

type MovementRow = {
  id: string;
  slug: string;
  name: string;
  era: string;
  summary: string;
  blurb: string;
  hero_image: string | null;
  sort: number;
};

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
  const rows = (await sql`select * from movements order by sort asc`) as unknown as MovementRow[];
  return rows.map(toMovement);
}

export const getMovement = cache(async (slug: string): Promise<Movement | undefined> => {
  const rows = (await sql`select * from movements where slug = ${slug}`) as unknown as MovementRow[];
  return rows[0] ? toMovement(rows[0]) : undefined;
});

export const getMovementById = cache(async (id: string): Promise<Movement | undefined> => {
  const rows = (await sql`select * from movements where id = ${id}`) as unknown as MovementRow[];
  return rows[0] ? toMovement(rows[0]) : undefined;
});

export type MovementWithCount = Movement & { artworkCount: number };

export async function listMovementsWithCounts(): Promise<MovementWithCount[]> {
  const rows = (await sql`
    select m.*, count(a.id)::int as artwork_count
    from movements m
    left join artworks a on a.movement_id = m.id
    group by m.id
    order by m.sort asc
  `) as unknown as (MovementRow & { artwork_count: number })[];
  return rows.map((row) => ({ ...toMovement(row), artworkCount: row.artwork_count }));
}

// Artists ---------------------------------------------------------------

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

function toArtist(row: ArtistRow): Artist {
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

export async function listArtists(): Promise<Artist[]> {
  const rows = (await sql`select * from artists order by name asc`) as unknown as ArtistRow[];
  return rows.map(toArtist);
}

export const getArtist = cache(async (slug: string): Promise<Artist | undefined> => {
  const rows = (await sql`select * from artists where slug = ${slug}`) as unknown as ArtistRow[];
  return rows[0] ? toArtist(rows[0]) : undefined;
});

export const getArtistById = cache(async (id: string): Promise<Artist | undefined> => {
  const rows = (await sql`select * from artists where id = ${id}`) as unknown as ArtistRow[];
  return rows[0] ? toArtist(rows[0]) : undefined;
});

export type ArtistWithCount = Artist & { artworkCount: number };

export async function listArtistsWithCounts(): Promise<ArtistWithCount[]> {
  const rows = (await sql`
    select ar.*, count(a.id)::int as artwork_count
    from artists ar
    left join artworks a on a.artist_id = ar.id
    group by ar.id
    order by ar.name asc
  `) as unknown as (ArtistRow & { artwork_count: number })[];
  return rows.map((row) => ({ ...toArtist(row), artworkCount: row.artwork_count }));
}

// Mediums ---------------------------------------------------------------

type MediumRow = { id: string; slug: string; name: string };

function toMedium(row: MediumRow): Medium {
  return { id: row.id, slug: row.slug, name: row.name };
}

export async function listMediums(): Promise<Medium[]> {
  const rows = (await sql`select * from mediums order by name asc`) as unknown as MediumRow[];
  return rows.map(toMedium);
}

export const getMedium = cache(async (slug: string): Promise<Medium | undefined> => {
  const rows = (await sql`select * from mediums where slug = ${slug}`) as unknown as MediumRow[];
  return rows[0] ? toMedium(rows[0]) : undefined;
});

export const getMediumById = cache(async (id: string): Promise<Medium | undefined> => {
  const rows = (await sql`select * from mediums where id = ${id}`) as unknown as MediumRow[];
  return rows[0] ? toMedium(rows[0]) : undefined;
});

// Artworks ---------------------------------------------------------------

export type ArtworkFilters = {
  movement?: string;
  artist?: string;
  status?: ArtworkStatus;
  featured?: boolean;
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
  movement_id: string;
  movement_slug: string;
  movement_name: string;
  movement_era: string;
  movement_summary: string;
  movement_blurb: string;
  movement_hero_image: string | null;
  movement_sort: number;
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

const ARTWORK_SELECT = `
  select
    a.id, a.slug, a.title, a.year, a.dimensions, a.materials, a.description,
    a.price, a.currency, a.edition, a.status, a.featured, a.images,
    m.id as movement_id, m.slug as movement_slug, m.name as movement_name, m.era as movement_era,
    m.summary as movement_summary, m.blurb as movement_blurb, m.hero_image as movement_hero_image, m.sort as movement_sort,
    ar.id as artist_id, ar.slug as artist_slug, ar.name as artist_name,
    ar.portrait as artist_portrait, ar.statement as artist_statement, ar.bio as artist_bio,
    ar.links as artist_links, ar.status as artist_status,
    md.id as medium_id, md.slug as medium_slug, md.name as medium_name
  from artworks a
  join artists ar on ar.id = a.artist_id
  join movements m on m.id = a.movement_id
  join mediums md on md.id = a.medium_id
`;

function toArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist: toArtist({
      id: row.artist_id,
      slug: row.artist_slug,
      name: row.artist_name,
      portrait: row.artist_portrait,
      statement: row.artist_statement,
      bio: row.artist_bio,
      links: row.artist_links,
      status: row.artist_status,
    }),
    movement: toMovement({
      id: row.movement_id,
      slug: row.movement_slug,
      name: row.movement_name,
      era: row.movement_era,
      summary: row.movement_summary,
      blurb: row.movement_blurb,
      hero_image: row.movement_hero_image,
      sort: row.movement_sort,
    }),
    medium: toMedium({ id: row.medium_id, slug: row.medium_slug, name: row.medium_name }),
    year: row.year,
    dimensions: row.dimensions,
    materials: row.materials,
    description: row.description,
    price: row.price === null ? null : Number(row.price),
    currency: row.currency,
    edition: row.edition ?? undefined,
    status: row.status,
    images: row.images,
    featured: row.featured,
  };
}

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
  if (filters.featured !== undefined) {
    params.push(filters.featured);
    conditions.push(`a.featured = $${params.length}`);
  }

  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";
  const orderBy = SORT_CLAUSES[filters.sort ?? "newest"];

  const rows = (await sql.query(`${ARTWORK_SELECT} ${where} order by ${orderBy}`, params)) as unknown as ArtworkRow[];
  return rows.map(toArtwork);
}

export const getArtwork = cache(async (slug: string): Promise<Artwork | undefined> => {
  const rows = (await sql.query(`${ARTWORK_SELECT} where a.slug = $1`, [slug])) as unknown as ArtworkRow[];
  return rows[0] ? toArtwork(rows[0]) : undefined;
});

export const getArtworkById = cache(async (id: string): Promise<Artwork | undefined> => {
  const rows = (await sql.query(`${ARTWORK_SELECT} where a.id = $1`, [id])) as unknown as ArtworkRow[];
  return rows[0] ? toArtwork(rows[0]) : undefined;
});

// Enquiries ---------------------------------------------------------------

export type EnquiryStatus = "open" | "responded" | "closed";

type EnquiryRow = {
  id: string;
  type: "purchase" | "enquiry";
  artwork_id: string | null;
  name: string;
  email: string;
  message: string | null;
  offer: string | null;
  status: EnquiryStatus;
  created_at: string;
};

export type EnquiryWithArtwork = Omit<EnquiryRow, "offer"> & {
  offer: number | null;
  artwork: { slug: string; title: string } | null;
};

export async function createEnquiry(input: {
  type: "purchase" | "enquiry";
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

export async function listEnquiries(): Promise<EnquiryWithArtwork[]> {
  const rows = (await sql`
    select e.*, a.slug as artwork_slug, a.title as artwork_title
    from enquiries e
    left join artworks a on a.id = e.artwork_id
    order by e.created_at desc
  `) as unknown as (EnquiryRow & { artwork_slug: string | null; artwork_title: string | null })[];

  return rows.map(({ artwork_slug, artwork_title, ...row }) => ({
    ...row,
    offer: row.offer === null ? null : Number(row.offer),
    artwork: artwork_slug && artwork_title ? { slug: artwork_slug, title: artwork_title } : null,
  }));
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await sql`update enquiries set status = ${status} where id = ${id}`;
}

// Sell submissions ---------------------------------------------------------------

export type SellSubmissionStatus = "pending" | "accepted" | "declined";

type SellSubmissionRow = {
  id: string;
  artist_name: string;
  artist_email: string;
  title: string;
  movement_id: string | null;
  medium_id: string | null;
  dimensions: string;
  asking_price: string | null;
  currency: string;
  message: string | null;
  status: SellSubmissionStatus;
  created_at: string;
};

export type SellSubmissionWithTaxonomy = Omit<SellSubmissionRow, "asking_price"> & {
  asking_price: number | null;
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
  await sql`
    insert into sell_submissions (artist_name, artist_email, title, movement_id, medium_id, dimensions, asking_price, currency, message)
    values (${input.artistName}, ${input.artistEmail}, ${input.title}, ${input.movementId}, ${input.mediumId}, ${input.dimensions}, ${input.askingPrice ?? null}, ${input.currency ?? "NGN"}, ${input.message ?? null})
  `;
}

export async function listSellSubmissions(): Promise<SellSubmissionWithTaxonomy[]> {
  const rows = (await sql`
    select s.*, m.name as movement_name, md.name as medium_name
    from sell_submissions s
    left join movements m on m.id = s.movement_id
    left join mediums md on md.id = s.medium_id
    order by s.created_at desc
  `) as unknown as (SellSubmissionRow & { movement_name: string | null; medium_name: string | null })[];

  return rows.map(({ movement_name, medium_name, ...row }) => ({
    ...row,
    asking_price: row.asking_price === null ? null : Number(row.asking_price),
    movement: movement_name ? { name: movement_name } : null,
    medium: medium_name ? { name: medium_name } : null,
  }));
}

export async function getSellSubmissionById(id: string): Promise<SellSubmissionWithTaxonomy | undefined> {
  const rows = (await sql`
    select s.*, m.name as movement_name, md.name as medium_name
    from sell_submissions s
    left join movements m on m.id = s.movement_id
    left join mediums md on md.id = s.medium_id
    where s.id = ${id}
  `) as unknown as (SellSubmissionRow & { movement_name: string | null; medium_name: string | null })[];

  const row = rows[0];
  if (!row) return undefined;
  const { movement_name, medium_name, ...rest } = row;
  return {
    ...rest,
    asking_price: rest.asking_price === null ? null : Number(rest.asking_price),
    movement: movement_name ? { name: movement_name } : null,
    medium: medium_name ? { name: medium_name } : null,
  };
}

export async function updateSellSubmissionStatus(id: string, status: SellSubmissionStatus): Promise<void> {
  await sql`update sell_submissions set status = ${status} where id = ${id}`;
}
