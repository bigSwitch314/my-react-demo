const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    filename: "js/[name].[hash:16].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      title: 'Custom template',
      inject: 'body',
      minify: {
        html5: true
      },
      hash: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new FriendlyErrorsWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      }
    ]
  },
  devServer: {
    port: '9080',
    contentBase: path.join(__dirname, '../public'),
    compress: false,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {}
  }
})