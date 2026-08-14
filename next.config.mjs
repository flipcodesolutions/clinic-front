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
      {
        source: '/doctor-panel',
        destination: '/doctor-panel/dashboard',
        permanent: false,
      },
      {
        source: '/clinic-panel',
        destination: '/clinic-panel/dashboard',
        permanent: false,
      },
      {
        source: '/super-admin-panel',
        destination: '/super-admin-panel/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;