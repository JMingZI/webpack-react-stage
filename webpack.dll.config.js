const path = require('path');
const webpack = require('webpack');

const vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux'
];

module.exports = {
    entry: {
        vendor: vendors,
    },
    output: {
        path: path.join(__dirname, 'caiyun'),
        filename: '[name].js',
        library: '[name]_library',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'caiyun', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname,
        })
    ],
};