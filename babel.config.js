module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "^react-native$": "react-native-web",
        },
      },
    ],
    ["@babel/plugin-transform-class-properties", { loose: false }],
    ["@babel/plugin-transform-private-methods", { loose: false }],
    ["@babel/plugin-transform-private-property-in-object", { loose: false }],
  ],
};
