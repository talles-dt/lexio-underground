// Renamed to next.config.cjs to resolve ESM/CJS conflict
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["react-native", "react-native-web"],
  experimental: {
    turbo: {
      browser: false, // Disable Turbopack for browser builds
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx"], // Metro fallback
    },
    typedRoutes: true,
    outputFileTracingRoot: __dirname,
  },
};
