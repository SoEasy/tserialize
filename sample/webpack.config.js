var webpack = require('webpack'),
    path = require('path');

module.exports = [{
    devtool: 'source-map',
    entry: {
        index: ['./index.ts']
    },
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    }
}];