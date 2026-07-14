/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
