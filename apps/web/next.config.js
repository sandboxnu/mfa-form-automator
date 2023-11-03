/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
  },
};

module.exports = nextConfig;
