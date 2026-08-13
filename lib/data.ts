import type { Artwork, ArtworkStatus, Movement } from "@/types";
import { MOCK_ARTWORKS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

/**
 * Data-access seam. Movements are live from Supabase; artworks still read
 * from the in-repo mock catalogue until real rows exist — swap listArtworks
 * and getArtwork for Supabase queries the same way once they do.
 */

type MovementRow = Database["public"]["Tables"]["movements"]["Row"];

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

export type MovementWithCount = Movement & { artworkCount: number };

export async function listMovementsWithCounts(): Promise<MovementWithCount[]> {
  const movements = await listMovements();
  return movements.map((movement) => ({
    ...movement,
    artworkCount: MOCK_ARTWORKS.filter((a) => a.movement.slug === movement.slug).length,
  }));
}

export type ArtworkFilters = {
  movement?: string;
  artist?: string;
  status?: ArtworkStatus;
  sort?: "newest" | "price-asc" | "price-desc" | "artist";
};

export async function listArtworks(filters: ArtworkFilters = {}): Promise<Artwork[]> {
  let results = [...MOCK_ARTWORKS];

  if (filters.movement) {
    results = results.filter((a) => a.movement.slug === filters.movement);
  }
  if (filters.artist) {
    results = results.filter((a) => a.artist.slug === filters.artist);
  }
  if (filters.status) {
    results = results.filter((a) => a.status === filters.status);
  }

  switch (filters.sort) {
    case "price-asc":
      results.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      results.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case "artist":
      results.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
      break;
    case "newest":
    default:
      results.sort((a, b) => b.year - a.year);
  }

  return results;
}

export async function getArtwork(slug: string): Promise<Artwork | undefined> {
  return MOCK_ARTWORKS.find((a) => a.slug === slug);
}
