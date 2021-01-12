const webpack = require("webpack");
const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  entry: {
    main: './example/main.js'
  },
  output: {
    path: path.join(__dirname, '../example/dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: path.join(__dirname, '../example/dist/index.html'),
      template: path.join(__dirname, '../example/index.html')
    }),
    new webpack.optimize.SplitChunksPlugin({
      chunks: 'all',
      minSize: 30 * 1024,
      maxSize: 300 * 1024,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      name: true, 
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all',
          reuseExistingChunk: true
        },
        default: {
          name: 'chunk',
          priority: -20,
          chunks: 'initial',
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    })
  ],
  devtool: 'eval-source-map'
});