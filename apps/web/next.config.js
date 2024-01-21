/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
    S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
    S3_UPLOAD_ACCESS_KEY: process.env.S3_UPLOAD_ACCESS_KEY,
    S3_UPLOAD_SECRET_KEY: process.env.S3_UPLOAD_SECRET_KEY,
  },
};

module.exports = nextConfig;
