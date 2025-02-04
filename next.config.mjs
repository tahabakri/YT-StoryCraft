/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export', // Enables static site generation
  basePath: process.env.NODE_ENV === 'production' ? '/ai-story-generator' : '', // If deploying to subpath
  trailingSlash: true,
}

export default nextConfig
