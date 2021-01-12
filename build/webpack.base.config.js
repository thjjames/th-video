const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        // exclude: /node_modules/, 
        use: {
          loader: 'vue-loader',
          options: {
            transformAssetUrls: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: ['xlink:href', 'href'],
              use: ['xlink:href', 'href']
            },
            loaders: {
              css: [
                'vue-style-loader',
                {
                  loader: 'css-loader'
                }
              ],
              less: [
                'vue-style-loader',
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'postcss-loader'
                },
                {
                  loader: 'less-loader'
                }
              ],
            }
          }
        }
      }, 
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/, 
        use: [
          'style-loader', 
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf|otf)\??.*$/,
        // exclude: /node_modules/, 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true,
    // https: true,
    host: '0.0.0.0',
    port: process.env.PORT || 8089,
    disableHostCheck: true,
    open: true,
    hot: true
  }
};