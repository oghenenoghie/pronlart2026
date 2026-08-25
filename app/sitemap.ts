import type { MetadataRoute } from "next";
import { listArtists, listArtworks, listMovements } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = ["", "/gallery", "/movements", "/artists", "/archive", "/sell", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movements, artists, artworks] = await Promise.all([listMovements(), listArtists(), listArtworks()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const movementEntries: MetadataRoute.Sitemap = movements.map((movement) => ({
    url: `${SITE_URL}/movements/${movement.slug}`,
    lastModified: new Date(),
  }));

  const artistEntries: MetadataRoute.Sitemap = artists.map((artist) => ({
    url: `${SITE_URL}/artists/${artist.slug}`,
    lastModified: new Date(),
  }));

  const artworkEntries: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${SITE_URL}/artworks/${artwork.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...movementEntries, ...artistEntries, ...artworkEntries];
}
