const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'video.min.js',
    chunkFilename: '[name].chunk.js',
    library: 'video',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
});