import type { Artwork, ArtworkStatus } from "@/types";
import { MOCK_ARTWORKS } from "@/lib/mock-data";

/**
 * Data-access seam. Reads from the in-repo mock catalogue until Supabase
 * (build order step 2) is wired up — swap the bodies below for Supabase
 * queries without touching any page or component that calls these.
 */

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
