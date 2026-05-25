const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add support for web extensions
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'js',
    'jsx',
    'ts',
    'tsx',
    'cjs',
    'mjs',
  ];

  return config;
})();
