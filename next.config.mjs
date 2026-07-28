/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/reviews',
        destination: '/specialties',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;