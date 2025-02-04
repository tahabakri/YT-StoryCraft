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
  basePath: process.env.NODE_ENV === 'production' ? '/ai-story-generator' : '',
  trailingSlash: true,
  experimental: {
    typedRoutes: false
  },
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  },
  output: 'standalone',
  productionBrowserSourceMaps: false
}

export default nextConfig
