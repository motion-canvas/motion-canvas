#!/usr/bin/env node

import path from 'path';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const projectFile = path.resolve(process.cwd(), process.argv[2]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compiler = webpack({
  entry: projectFile,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.glsl$/i,
        type: 'asset/source',
      },
      {
        test: /\.label$/i,
        use: [
          {
            loader: 'label-loader',
          },
        ],
      },
      {
        test: /\.anim$/i,
        use: [
          {
            loader: 'animation-loader',
          },
        ],
      },
      {
        test: /\.png$/i,
        use: [
          {
            loader: 'sprite-loader',
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, './loaders'),
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      MC: path.resolve(__dirname, '../dist'),
      '@motion-canvas/core': path.resolve(__dirname, '../dist'),
      '@motion-canvas/ui': path.resolve(__dirname, '../../ui/dist'),
    },
  },
  output: {
    filename: `index.js`,
    path: __dirname,
  },
  experiments: {
    topLevelAwait: true,
  },
});

const server = new WebpackDevServer(
  {
    static: path.resolve(__dirname, '../public'),
    compress: true,
    port: 9000,
    hot: true,
  },
  compiler,
);
server.start().catch(console.error);
