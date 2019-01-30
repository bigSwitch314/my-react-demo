const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')


module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: "js/[name].[chunkhash:16].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      title: 'Custom template',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
    }),
    new CleanWebpackPlugin(['../dist'], { allowExternal: true }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css',
    })
  ],
  module: {
    rules:
      [
        {
          test: /\.(css|less)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]__[hash:7]'
              }
            },
            {
              loader: 'less-loader',
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
      ]
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin(),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: true
          ? {
            map: { inline: false }
          }
          : {}
      })
    ],
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          priority: 200,
          test: "framework",
          name: "framework",
          enforce: true,
          reuseExistingChunk: true
        },
        vendor: {
          priority: 10,
          test: /node_modules/,
          name: "vendor",
          enforce: true,
          reuseExistingChunk: true
        }
      }
    },
  }
})
