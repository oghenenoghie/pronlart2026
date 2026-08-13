/**
 * scripts/seed-artworks.ts
 * ----------------------------------------------------------------------------
 * Seeds real artwork rows from The Met's Open Access (CC0) collection into the
 * gallery's actual schema: uploads each image to the `artworks` Storage bucket,
 * resolves/creates the artist and medium rows, maps the work onto one of the
 * 13 seeded movements, then upserts into public.artworks.
 *
 *   fetch (Met search + object) → download image → probe dimensions
 *     → upload to Storage → resolve artist/movement/medium → upsert artworks row
 *
 * Prereqs:
 *   npm install
 *   npm run seed:artworks
 *
 * Env (.env.local — never commit real values):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service role — bypasses RLS + Storage RLS
 *
 * Optional env:
 *   SEED_QUERY=painting        # Met search term
 *   SEED_LIMIT=40              # how many artworks to seed
 *   SEED_HIGHLIGHTS=true       # restrict to Met "highlights" (famous, gallery-grade)
 *   SEED_DEPARTMENT_ID=        # e.g. 11 = European Paintings (blank = all)
 */

import { createClient } from "@supabase/supabase-js";
import imageSize from "image-size";
import type { Database } from "../types/supabase";

try {
  process.loadEnvFile(".env.local");
} catch {
  // no .env.local — fall back to whatever is already in the environment
}

const SUPABASE_URL = required("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");
const QUERY = process.env.SEED_QUERY ?? "painting";
const LIMIT = Number(process.env.SEED_LIMIT ?? 40);
const HIGHLIGHTS = (process.env.SEED_HIGHLIGHTS ?? "true") === "true";
const DEPARTMENT_ID = process.env.SEED_DEPARTMENT_ID ?? "";

const BUCKET = "artworks";
const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
const DEFAULT_CURRENCY = "NGN";

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Met API types (only the fields we use) ───────────────────────────────────
interface MetSearch {
  total: number;
  objectIDs: number[] | null;
}
interface MetObject {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  objectBeginDate: number;
  medium: string;
  dimensions: string;
  classification: string;
  creditLine: string;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nSeeding "${QUERY}" — target ${LIMIT} artworks\n`);

  const movementIdBySlug = await loadMovements();
  const artistIdBySlug = new Map<string, string>();
  const mediumIdBySlug = new Map<string, string>();

  const ids = await searchObjectIds();
  if (ids.length === 0) {
    console.error("No object IDs returned from Met search. Try a different SEED_QUERY.");
    process.exit(1);
  }

  let seeded = 0;
  for (const id of ids) {
    if (seeded >= LIMIT) break;
    try {
      const obj = await fetchObject(id);
      if (!obj || !obj.isPublicDomain || !obj.primaryImage) continue;
      if (!Number.isFinite(obj.objectBeginDate)) continue; // artworks.year is NOT NULL

      const artistId = await getOrCreateArtist(obj.artistDisplayName || "Unknown artist", artistIdBySlug);
      const movementId = movementIdBySlug.get(pickMovementSlug(obj));
      if (!movementId) throw new Error("no movement resolved (should be unreachable)");
      const mediumId = await getOrCreateMedium(obj.medium || "Mixed media", mediumIdBySlug);

      const bytes = await downloadImage(obj.primaryImage);
      const { width, height } = imageSize(bytes);
      const storagePath = `the-met/${obj.objectID}.jpg`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, bytes, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw new Error(`storage upload: ${upErr.message}`);

      const slug = `${slugify(obj.title || "untitled")}-${obj.objectID}`;

      const { error: rowErr } = await supabase.from("artworks").upsert(
        {
          slug,
          title: obj.title || "Untitled",
          artist_id: artistId,
          movement_id: movementId,
          medium_id: mediumId,
          year: obj.objectBeginDate,
          dimensions: obj.dimensions || "Dimensions not recorded",
          materials: obj.medium || "Mixed media",
          description: obj.creditLine || "",
          price: null,
          currency: DEFAULT_CURRENCY,
          status: "available",
          featured: false,
          images: [
            {
              path: storagePath,
              alt: `${obj.title || "Untitled"}${obj.artistDisplayName ? ` by ${obj.artistDisplayName}` : ""}`,
              isPrimary: true,
              width: width ?? 1200,
              height: height ?? 1500,
            },
          ],
        },
        { onConflict: "slug" }
      );
      if (rowErr) throw new Error(`row upsert: ${rowErr.message}`);

      seeded++;
      console.log(`✓ [${seeded}/${LIMIT}] ${obj.title} — ${obj.artistDisplayName || "Unknown"}`);
    } catch (err) {
      console.warn(`✗ skipped object ${id}: ${(err as Error).message}`);
    }
    await sleep(150); // be polite to the Met API
  }

  console.log(`\nDone. Seeded ${seeded} artworks into "${BUCKET}" + public.artworks.`);
}

// ── Resolvers ────────────────────────────────────────────────────────────────

async function loadMovements(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from("movements").select("id, slug");
  if (error) throw new Error(`loading movements: ${error.message}`);
  if (!data || data.length === 0) {
    throw new Error(
      "No rows in movements — apply supabase/migrations/*.sql (schema + taxonomy seed) before running this script."
    );
  }
  return new Map(data.map((m) => [m.slug, m.id]));
}

async function getOrCreateArtist(name: string, cache: Map<string, string>): Promise<string> {
  const slug = slugify(name);
  const cached = cache.get(slug);
  if (cached) return cached;

  const { data: existing, error: selErr } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (selErr) throw new Error(`looking up artist ${slug}: ${selErr.message}`);
  if (existing) {
    cache.set(slug, existing.id);
    return existing.id;
  }

  const { data: inserted, error: insErr } = await supabase
    .from("artists")
    .insert({ slug, name, status: "active" })
    .select("id")
    .single();
  if (insErr) throw new Error(`creating artist ${slug}: ${insErr.message}`);
  cache.set(slug, inserted.id);
  return inserted.id;
}

async function getOrCreateMedium(name: string, cache: Map<string, string>): Promise<string> {
  const slug = slugify(name);
  const cached = cache.get(slug);
  if (cached) return cached;

  const { data: existing, error: selErr } = await supabase
    .from("mediums")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (selErr) throw new Error(`looking up medium ${slug}: ${selErr.message}`);
  if (existing) {
    cache.set(slug, existing.id);
    return existing.id;
  }

  const { data: inserted, error: insErr } = await supabase
    .from("mediums")
    .insert({ slug, name })
    .select("id")
    .single();
  if (insErr) throw new Error(`creating medium ${slug}: ${insErr.message}`);
  cache.set(slug, inserted.id);
  return inserted.id;
}

/**
 * The Met doesn't tag objects with an art-historical movement, so this maps
 * material/classification first (bronze/sculpture/woodwork are medium-driven
 * in our taxonomy), then falls back to date bands for everything else. It's
 * a heuristic, not art history — expect misclassification at the edges.
 */
function pickMovementSlug(obj: MetObject): string {
  const text = `${obj.classification} ${obj.medium}`.toLowerCase();
  if (/bronze/.test(text)) return "bronze";
  if (/(sculpture|marble|stone|terracotta)/.test(text)) return "sculpture";
  if (/(wood|furniture|carving)/.test(text)) return "woodwork";

  const year = obj.objectBeginDate;
  if (year < 1600) return "renaissance";
  if (year < 1700) return "baroque";
  if (year < 1790) return "rococo";
  if (year < 1860) return "post-impressionism";
  if (year < 1880) return "impressionism";
  if (year < 1900) return "post-impressionism";
  if (year < 1915) return "cubism";
  if (year < 1930) return "surrealism";
  if (year < 1970) return "abstract-art";
  return "contemporary-art";
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function searchObjectIds(): Promise<number[]> {
  const params = new URLSearchParams({ q: QUERY, hasImages: "true" });
  if (HIGHLIGHTS) params.set("isHighlight", "true");
  if (DEPARTMENT_ID) params.set("departmentId", DEPARTMENT_ID);

  const res = await fetch(`${MET}/search?${params}`);
  if (!res.ok) throw new Error(`Met search failed: ${res.status}`);
  const data = (await res.json()) as MetSearch;
  return data.objectIDs ?? [];
}

async function fetchObject(id: number): Promise<MetObject | null> {
  const res = await fetch(`${MET}/objects/${id}`);
  if (!res.ok) return null;
  return (await res.json()) as MetObject;
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image download: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
