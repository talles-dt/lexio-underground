const nextConfig = {
  transpilePackages: ["react-native", "react-native-web"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    };
    config.resolve.fallback = { fs: false, path: false, os: false };
    return config;
  },
  experimental: {
    turbo: {
      browser: false,
      resolveExtensions: [".web.js", ".web.jsx", ".js", ".jsx", ".ts", ".tsx"],
    },
  },
};

export default nextConfig;
