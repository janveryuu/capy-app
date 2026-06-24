/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverExternalPackages: ['pg', 'bcryptjs', '@prisma/client', '@prisma/adapter-pg'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
