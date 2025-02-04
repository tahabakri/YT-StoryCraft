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
  experimental: {
    typedRoutes: false
  },
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  },
  productionBrowserSourceMaps: false,
  // Configure for server-side rendering only, no static exports
  output: 'standalone'
}
