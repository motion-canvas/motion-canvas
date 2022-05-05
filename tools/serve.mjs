#!/usr/bin/env node

import path from 'path';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const projectFile = path.resolve(process.cwd(), process.argv[2]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withUI = process.argv[3] === '--ui';

const compiler = webpack({
  entry: withUI
    ? {
        index: projectFile,
        ui: path.resolve(__dirname, '../../ui/src/index.ts'),
      }
    : {
        index: projectFile,
      },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
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
        include: path.resolve(__dirname, '../../ui/'),
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, '../../ui/tsconfig.json'),
          instance: 'ui',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, '../../ui/'),
        loader: 'ts-loader',
        options: {
          instance: 'project',
        },
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
      {
        oneOf: [
          {
            test: /\.wav$/i,
            resourceQuery: /meta/,
            use: [
              {
                loader: 'wav-loader',
              },
            ],
          },
          {
            test: /\.wav$/i,
            type: 'asset',
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
      MC: path.resolve(__dirname, '../src'),
      '@motion-canvas/core': path.resolve(__dirname, '../src'),
    },
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
  },
  output: {
    filename: `[name].js`,
    path: __dirname,
    uniqueName: 'motion-canvas',
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
