/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel Blob returns full public URLs directly, so images are served
    // through Next's built-in Image Optimization API — no custom loader.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
