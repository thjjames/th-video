const webpack = require("webpack");
const path = require('path');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const portfinder = require('portfinder');

const __webpackConfig__ = merge(webpackBaseConfig, {
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
  devServer: {
    historyApiFallback: true,
    // https: true,
    host: '0.0.0.0',
    port: 8089,
    useLocalIp: true,
    disableHostCheck: true,
    open: true,
    hot: true
  },
  devtool: 'eval-source-map'
});

module.exports = new Promise((resolve, reject) => {
  const port = process.env.PORT || __webpackConfig__.devServer.port;
  portfinder.getPort({
    port,
    stopPort: port + 100
  }, function (err, newPort) {
    if (err) {
      reject(err);
    } else {
      if (port !== newPort) {
        console.log(chalk.bold.blueBright(`port ${port} is in use, use ${newPort} instead!`));
        __webpackConfig__.devServer.port = newPort;
      }
    }
    resolve(__webpackConfig__);
  });  
});