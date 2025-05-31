module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    root: ['./src'],
                    extensions: ['.js', '.json'],
                    alias: {
                        '@': './src',
                        '@components': './src/components',
                        '@screens': './src/screens',
                        '@services': './src/services',
                        '@utils': './src/utils',
                        '@theme': './src/theme',
                        '@store': './src/store',
                        '@hooks': './src/hooks',
                        '@assets': './assets'
                    }
                }
            ]
        ]
    }
}