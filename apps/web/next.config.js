/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID
  },
};

module.exports = nextConfig;
