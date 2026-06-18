import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/wiki/:path*',
        destination: '/article/:path*',
        permanent: true,
      },
      {
        source: '/w/index.php',
        has: [
          {
            type: 'query',
            key: 'title',
            value: '(?<title>.*)',
          },
        ],
        destination: '/article/:title',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
