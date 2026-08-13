/**
 * scripts/seed-movement-heroes.ts
 * ----------------------------------------------------------------------------
 * Sets movements.hero_image for each of the 13 seeded movements, sourcing a
 * representative image from The Met's Open Access (CC0) collection — reusing
 * the same isPublicDomain-gated pipeline as scripts/seed-artworks.ts, which
 * doubles as copyright due diligence: still-copyrighted artists (Picasso,
 * Dalí, ...) are excluded by the Met's own metadata, not a hand-picked list.
 *
 * "contemporary-art" has thin public-domain coverage almost by definition
 * (recent work is rarely out of copyright) — expect it to come up empty and
 * stay unset rather than force a bad match.
 *
 * Prereqs:
 *   npm install
 *   npm run seed:movement-heroes
 *
 * Env (.env.local — never commit real values):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import imageSize from "image-size";
import { createSeedClient, downloadImage, extensionForContentType, loadLocalEnv, sleep } from "./lib/seed-helpers";

loadLocalEnv();

const BUCKET = "artworks";
const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
const CANDIDATES_TO_CHECK = 15;

const supabase = createSeedClient();

interface MetSearch {
  objectIDs: number[] | null;
}
interface MetObject {
  isPublicDomain: boolean;
  primaryImage: string;
  title: string;
}

// Search query per movement, relying on isPublicDomain to gate licensing —
// not an attempt at art-historical precision, just a reasonable illustration.
const QUERY_BY_MOVEMENT_SLUG: Record<string, string> = {
  renaissance: "Renaissance",
  baroque: "Baroque",
  rococo: "Rococo",
  impressionism: "Impressionism",
  "post-impressionism": "Post-Impressionism",
  expressionism: "Expressionism",
  cubism: "Cubism",
  surrealism: "Surrealism",
  "abstract-art": "Abstract",
  "contemporary-art": "Contemporary",
  sculpture: "sculpture",
  woodwork: "wood carving",
  bronze: "bronze sculpture",
};

async function main() {
  const { data: movements, error } = await supabase.from("movements").select("id, slug");
  if (error) throw new Error(`loading movements: ${error.message}`);
  if (!movements || movements.length === 0) {
    throw new Error(
      "No rows in movements — apply supabase/migrations/*.sql (schema + taxonomy seed) before running this script."
    );
  }

  let set = 0;
  for (const movement of movements) {
    const query = QUERY_BY_MOVEMENT_SLUG[movement.slug];
    if (!query) {
      console.warn(`✗ ${movement.slug}: no query configured, skipping`);
      continue;
    }

    try {
      const obj = await findPublicDomainCandidate(query);
      if (!obj) {
        console.warn(`✗ ${movement.slug}: no public-domain image found for "${query}"`);
        continue;
      }

      const { bytes, contentType } = await downloadImage(obj.primaryImage);
      const { width, height } = imageSize(bytes);
      const path = `movements/${movement.slug}.${extensionForContentType(contentType)}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType, upsert: true });
      if (upErr) throw new Error(`storage upload: ${upErr.message}`);

      const { error: updErr } = await supabase.from("movements").update({ hero_image: path }).eq("id", movement.id);
      if (updErr) throw new Error(`movements update: ${updErr.message}`);

      set++;
      console.log(`✓ ${movement.slug}: "${obj.title}" (${width}×${height})`);
    } catch (err) {
      console.warn(`✗ ${movement.slug}: ${(err as Error).message}`);
    }
    await sleep(150); // be polite to the Met API
  }

  console.log(`\nDone. Set hero_image for ${set}/${movements.length} movements.`);
}

async function findPublicDomainCandidate(query: string): Promise<MetObject | null> {
  for (const isHighlight of [true, false]) {
    const params = new URLSearchParams({ q: query, hasImages: "true", isHighlight: String(isHighlight) });
    const res = await fetch(`${MET}/search?${params}`);
    if (!res.ok) continue;
    const { objectIDs } = (await res.json()) as MetSearch;
    if (!objectIDs || objectIDs.length === 0) continue;

    for (const id of objectIDs.slice(0, CANDIDATES_TO_CHECK)) {
      const objRes = await fetch(`${MET}/objects/${id}`);
      if (!objRes.ok) continue;
      const obj = (await objRes.json()) as MetObject;
      if (obj.isPublicDomain && obj.primaryImage) return obj;
    }
  }
  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
