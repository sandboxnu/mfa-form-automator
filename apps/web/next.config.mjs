/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // You may not need this, it's just to support moduleResolution: 'node16'
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
    turbo: {},
    optimizePackageImports: ["@chakra-ui/react"],
  },
  reactStrictMode: true,
  env: {
    PORT: process.env.FRONTEND_PORT,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_REDIRECT_URI: process.env.AZURE_REDIRECT_URI,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
};

export default nextConfig;
