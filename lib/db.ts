import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let client: Sql | undefined;

/**
 * Lazily creates the Neon client on first real query rather than at module
 * import time — Next.js evaluates every route module (including ones that
 * never run, like during CI's build-time "Collect page data" pass) as part
 * of static analysis, so throwing here eagerly would fail builds that never
 * actually need a database connection.
 */
function getClient(): Sql {
  if (!client) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is not set");
    client = neon(databaseUrl);
  }
  return client;
}

/** Neon Postgres client — the system of record for the catalogue. */
export const sql: Sql = new Proxy((() => {}) as unknown as Sql, {
  apply(_target, _thisArg, args) {
    return (getClient() as unknown as (...a: unknown[]) => unknown)(...(args as []));
  },
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});
