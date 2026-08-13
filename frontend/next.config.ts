import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'http', hostname: 'imprinta_backend', port: '8000' },
      { protocol: 'https', hostname: 'imprinta.uz' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://backend:8000/uploads/:path*',
      },
      {
        source: '/gallery/:path*',
        destination: 'http://backend:8000/gallery/:path*',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
