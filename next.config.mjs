import { fileURLToPath } from 'node:url';
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, os: false };
    return config;
  },
};
export default nextConfig;
