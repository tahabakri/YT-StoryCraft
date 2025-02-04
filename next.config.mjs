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
  productionBrowserSourceMaps: false,
  // Remove basePath for Vercel deployment since it's specific to GitHub Pages
  output: 'standalone'
}

export default nextConfig
