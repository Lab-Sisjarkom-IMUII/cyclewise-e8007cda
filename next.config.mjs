/** @type {import('next').NextConfig} */
// Redeploy trigger: 2026-01-02
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
