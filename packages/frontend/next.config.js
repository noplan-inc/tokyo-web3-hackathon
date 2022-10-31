/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loader: "default",
    domains: ["localhost"],
    unoptimized: true
  },
  trailingSlash: true,
}

module.exports = nextConfig
