const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the new key for Next.js 14+
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Avatars
      },
      {
        protocol: 'https',
        hostname: 'api.telegram.org', // Telegram files
      }
    ],
  },
}

module.exports = withNextIntl(nextConfig);
