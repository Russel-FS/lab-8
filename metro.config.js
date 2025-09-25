const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add asset extensions to handle images properly
config.resolver.assetExts.push('png');

module.exports = withNativeWind(config, { input: './global.css' });
