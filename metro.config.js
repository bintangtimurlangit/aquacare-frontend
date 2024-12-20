const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { transformer, resolver } = config;

    // Simple resolver configuration for React Three Fiber
    config.resolver = {
        ...resolver,
        assetExts: [
            ...resolver.assetExts,
            'glb', 'gltf', 'png', 'jpg'
        ],
        sourceExts: [
            'js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'
        ]
    };

    return config;
})();