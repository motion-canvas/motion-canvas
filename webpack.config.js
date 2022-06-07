const path = require('path');

module.exports = (env, argv) => ({
  entry: './src/index.ts',
  mode: argv.mode ?? 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
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
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 9001,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
