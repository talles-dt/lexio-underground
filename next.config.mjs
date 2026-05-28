import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip TS errors — hybrid RN/Next.js codebase has type conflicts
  typescript: {
    ignoreBuildErrors: true,
  },

  // Alias react-native → react-native-web so Turbopack never parses RN's Flow source
  turbopack: {
    root: resolve(__dirname),
    resolveAlias: {
      "react-native": "react-native-web",
      "expo-clipboard": "./src/stubs/expo-clipboard.js",
    },
  },

  images: {
    remotePatterns: [{ hostname: "lexio.smugmug.com" }],
  },

  reactStrictMode: true,
};

export default nextConfig;
