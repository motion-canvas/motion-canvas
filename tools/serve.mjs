#!/usr/bin/env node

import path from 'path';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const projectFile = path.resolve(process.cwd(), process.argv[2]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isLinked = !__dirname.includes('node_modules');

const compiler = webpack({
  entry: projectFile,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules([\\]+|\/)+(?!@aarthificial)/,
        options: {
          allowTsInNodeModules: true,
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      MC: path.resolve(__dirname, isLinked ? '../src' : '../dist'),
    },
  },
  output: {
    filename: `index.js`,
    path: __dirname,
  },
  watchOptions: {
    ignored: /node_modules([\\]+|\/)+(?!@aarthificial)/,
  },
  devServer: {
    static: path.resolve(__dirname, '../public'),
    compress: true,
    port: 9000,
  },
});
const server = new WebpackDevServer(
  {
    static: path.resolve(__dirname, '../public'),
    compress: true,
    port: 9000,
    open: true,
  },
  compiler,
);
server.start().catch(console.error);
