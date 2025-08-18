/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Environment variables that should be available at build time
  env: {
    // Add any build-time environment variables here
  },
  
  // Configure image domains if you're using next/image
  images: {
    domains: [
      'localhost',
      'justicebotai.firebaseapp.com',
      'justicebotai.web.app'
    ],
  },
  
  // Configure redirects if needed
  async redirects() {
    return [];
  },
  
  // Configure rewrites if needed
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
