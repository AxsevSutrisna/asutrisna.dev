/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pages directory is in src/pages
  dir: {
    pages: 'src/pages',
  },
  // Enable SWR and other optimizations
  swcMinify: true,
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
