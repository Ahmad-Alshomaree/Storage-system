/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  distDir: 'dist',
  assetPrefix: './',
  basePath: '',
  trailingSlash: true,
  serverExternalPackages: ['@tauri-apps/api'],
  experimental: {},
}

export default nextConfig
