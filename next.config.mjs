/**
 * Every <Image> source in this app is same-origin (/api/images/{id}, backed
 * by Neon Postgres — see that route, which already sets an immutable
 * 1-year Cache-Control). Next's built-in optimizer would still make its own
 * internal HTTP fetch back to that route before resizing, and that fetch
 * has a tighter timeout than a normal page load — on a scale-to-zero Neon
 * compute, that self-fetch can lose the race against the compute waking up
 * and render a broken image even though the data is fine. Skipping
 * optimization removes that extra hop; the route's own cache header still
 * makes repeat loads free.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
