const path = require('path');

module.exports = {
  entry: {
    ui: path.resolve(__dirname, '../ui/src/index.ts'),
  },
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {modules: true}},
          {loader: 'sass-loader'},
        ],
      },
      {
        test: /\.tsx?$/,
        // include: path.resolve(__dirname, '../ui/'),
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, '../ui/tsconfig.json'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@motion-canvas/core': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
  },
  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, 'public'),
    uniqueName: 'motion-canvas',
  },
  experiments: {
    topLevelAwait: true,
  },
};