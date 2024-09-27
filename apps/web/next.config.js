/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    STORAGE_BLOB_URL: process.env.STORAGE_BLOB_URL,
  },
};

module.exports = nextConfig;
