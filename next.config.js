/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Public runtime config
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
  
  // Server runtime config
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: process.env.MY_SECRET,
  },
  
  // Experimental features (none required for Next.js 15 app router)
  experimental: {},
  async rewrites() {
    return [
      {
        source: '/authPage/browser-callback',
        destination: '/authPage/browser-callback',
      },
      // Keep query parameters
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here
    return config;
  },
};

module.exports = nextConfig;
