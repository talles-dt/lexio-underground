/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["react-native", "react-native-web"], // Silence workspace warning
  // Turbopack settings
  experimental: {
    typedRoutes: true,
    turbo: {
      root: __dirname,
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx"], // Fallback to Webpack
    },
  },
};

export default nextConfig;
