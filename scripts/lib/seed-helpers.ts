/**
 * Shared helpers for scripts/seed-*.ts. Nothing here is Next.js-aware — these
 * scripts run standalone via `tsx`, outside the app's request lifecycle.
 */

import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/supabase";

/**
 * Minimal, dependency-free .env.local reader — doesn't rely on
 * process.loadEnvFile (Node 20.6+/21.7+ only) so it works on any Node LTS.
 * Doesn't override variables already set in the real environment.
 */
export function loadLocalEnv(): void {
  let contents: string;
  try {
    contents = readFileSync(".env.local", "utf8");
  } catch {
    return; // no .env.local — fall back to whatever is already in the environment
  }

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

export function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

export function createSeedClient(): SupabaseClient<Database> {
  const url = required("NEXT_PUBLIC_SUPABASE_URL");
  const key = required("SUPABASE_SERVICE_ROLE_KEY");
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function extensionForContentType(contentType: string): string {
  return EXTENSION_BY_CONTENT_TYPE[contentType.split(";")[0].trim()] ?? "jpg";
}

export async function downloadImage(url: string): Promise<{ bytes: Buffer; contentType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image download failed (${res.status}): ${url}`);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  return { bytes: Buffer.from(await res.arrayBuffer()), contentType };
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const ARTIST_DESCRIPTION_HINTS = ["painter", "sculptor", "artist", "printmaker", "engraver", "illustrator"];

/**
 * Best-effort real portrait lookup for a named real person via Wikidata's P18
 * (image) claim — every P18 value is required by Commons policy to be a
 * freely-licensed file, so anything resolved here is safe to re-host. Only
 * trusts a match whose Wikidata description reads as an artist, to avoid
 * attaching an unrelated same-name person's photo. Returns null on any
 * ambiguity or failure — callers should treat "no portrait" as the normal
 * outcome, not an error.
 */
export async function resolveWikidataPortrait(name: string): Promise<{ bytes: Buffer; contentType: string } | null> {
  try {
    const searchRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=5&format=json`
    );
    if (!searchRes.ok) return null;
    const search = (await searchRes.json()) as { search?: { id: string; description?: string }[] };
    const match = search.search?.find((r) =>
      ARTIST_DESCRIPTION_HINTS.some((hint) => r.description?.toLowerCase().includes(hint))
    );
    if (!match) return null;

    const claimsRes = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${match.id}&property=P18&format=json`
    );
    if (!claimsRes.ok) return null;
    const claims = (await claimsRes.json()) as {
      claims?: { P18?: { mainsnak?: { datavalue?: { value?: string } } }[] };
    };
    const filename = claims.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    if (!filename) return null;

    const fileUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
    return await downloadImage(fileUrl);
  } catch {
    return null;
  }
}
