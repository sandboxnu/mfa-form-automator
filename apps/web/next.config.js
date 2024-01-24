/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
    S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
    S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
    S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
