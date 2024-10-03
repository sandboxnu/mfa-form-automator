/** @type {import('next').NextConfig} */
const nextConfig = {
  
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    STORAGE_BLOB_URL: process.env.STORAGE_BLOB_URL,
  },
  
};

module.exports = nextConfig;
