/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
  },
};

module.exports = nextConfig;
