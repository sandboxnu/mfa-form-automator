/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    STORAGE_BLOB_URL: process.env.STORAGE_BLOB_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
};

module.exports = nextConfig;
