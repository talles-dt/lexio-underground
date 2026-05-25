/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack aliasing for web builds
  webpack: (config, { isServer }) => {
    // Alias stripe-react-native to our web stub for browser builds
    if (!isServer) {
      config.resolve.alias["@stripe/stripe-react-native"] =
        require("path").resolve("./src/stubs/stripe-react-native.js");
    }

    return config;
  },

  // Optional: Add React Native web compatibility
  experimental: {
    // Enable React Native web features if needed
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  },
  turbopack: {},
};

module.exports = nextConfig;
