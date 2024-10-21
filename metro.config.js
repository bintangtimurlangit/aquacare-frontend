const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { transformer, resolver } = config;

    // Configuring transformer for react-native-svg-transformer
    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
    };

    // Merging resolver configuration for react-native-svg-transformer and React Three Fiber
    config.resolver = {
        ...resolver,
        assetExts: [
            ...resolver.assetExts.filter((ext) => ext !== "svg"),
            'glb', 'gltf', 'png', 'jpg'  // For React Three Fiber
        ],
        sourceExts: [
            ...resolver.sourceExts,
            "svg",  // For react-native-svg-transformer
            "js", "jsx", "json", "ts", "tsx", "cjs", "mjs"  // For React Three Fiber
        ]
    };

    return config;
})();
