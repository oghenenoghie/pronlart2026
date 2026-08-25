/**
 * One-time admin bootstrap: creates the first Neon Auth account and prints
 * the SQL to run (via `npx neon` or the Neon console) to grant it the
 * `admin` role — mirrors the original "create in the dashboard, then
 * promote" pattern, just against Neon Auth instead of Supabase.
 *
 * Usage: npm run create-admin -- --email you@example.com --password 'a-strong-password' --name 'Pronlart Admin'
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Minimal .env.local loader — doesn't override variables already set in the real environment. */
function loadLocalEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const [, key, rawValue = ""] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function readArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

async function main() {
  loadLocalEnv();
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is not set (see .env.local).");

  const email = readArg("--email");
  const password = readArg("--password");
  const name = readArg("--name") ?? "Pronlart Admin";
  if (!email || !password) {
    throw new Error("Usage: npm run create-admin -- --email you@example.com --password 'a-strong-password'");
  }

  const res = await fetch(`${baseUrl}/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`Sign-up failed (${res.status}): ${body?.message ?? JSON.stringify(body)}`);
  }

  const userId = body?.user?.id;
  console.info(`Created account for ${email} (id: ${userId ?? "unknown"}).`);
  console.info("Now grant it admin access by running this against your Neon database:\n");
  console.info(`  update neon_auth.user set role = 'admin' where email = '${email}';\n`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
