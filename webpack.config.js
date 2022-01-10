const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    target: 'browserslist',
    output: {
        filename: 'index.js',
        library: {
            name: 'router',
            type: 'umd'
        },
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ]
                        ],
                        // plugins: ["@babel/plugin-transform-runtime"],
                    },
                }
            }
        ]
    }
}