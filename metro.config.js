const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts },
    transformer,
  } = await getDefaultConfig(__dirname);

  return {
    resolver: {
      sourceExts: [...sourceExts, "svg"],
    },
    transformer: {
      ...transformer,
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
  };
})();
