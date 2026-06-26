/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  env: {
    BACKEND_URL: process.env.BACKEND_URL || "http://localhost:4000",
  },
};
module.exports = nextConfig;
