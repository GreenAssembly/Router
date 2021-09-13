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
    }
}