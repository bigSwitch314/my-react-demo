const path = require('path')
const SRC_PATH = path.resolve(__dirname, '../src')
const DIST_PATH = path.resolve(__dirname, '../dist')

module.exports = {
  entry: {
    app: './src/index.js',
    framework: ['react', 'react-dom']
  },
  output: {
    filename: "js/bundle.js",
    path: DIST_PATH
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        include: SRC_PATH,
      }
    ]
  },
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx', 'json'],
    alias: {
      pages: path.resolve(SRC_PATH, 'pages'),
      images: path.resolve(SRC_PATH, 'assets/images'),
      modules: path.resolve(SRC_PATH, 'modules'),
      utils: path.resolve(SRC_PATH, 'utils'),
      components: path.resolve(SRC_PATH, 'components'),
    },
  },
}
