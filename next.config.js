/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // 빌드에서 제외할 경로
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/sneaker-shop-design-main/**'],
    };
    return config;
  },
};

module.exports = nextConfig;

