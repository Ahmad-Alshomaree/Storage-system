/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // output: 'export' is required for the Tauri build because the frontend
  // is shipped as static files that the Tauri runtime will load directly.
  output: 'export',
  distDir: 'dist',
  assetPrefix: './',
  basePath: '',
  trailingSlash: true,
  serverExternalPackages: ['@tauri-apps/api'],
  experimental: {},
}

export default nextConfig
