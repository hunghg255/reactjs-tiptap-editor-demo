/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shiki'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
