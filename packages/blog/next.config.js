/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loader: "default",
    domains: ["strapi.2an.co"],
    unoptimized: true
  },
  trailingSlash: true,
}

module.exports = nextConfig
