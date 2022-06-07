#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import meow from 'meow';
import UIPlugin from './plugins/UIPlugin.mjs';

const cli = meow({
  importMeta: import.meta,
  flags: {
    uiServer: {
      type: 'boolean',
      default: false,
    },
    uiPath: {
      type: 'string',
      default: '',
    },
    output: {
      type: 'string',
      alias: 'o',
      default: 'output',
    },
  },
});

cli.flags.uiPath ||= cli.flags.uiServer
  ? 'http://localhost:9001/main.js'
  : './node_modules/@motion-canvas/ui/dist';

const projectFile = path.resolve(process.cwd(), cli.input[0]);
const renderOutput = path.resolve(process.cwd(), cli.flags.output);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compiler = webpack({
  entry: {project: projectFile},
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
        test: /\.mp4/i,
        type: 'asset',
      },
      {
        test: /\.wav$/i,
        type: 'asset',
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
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
      path.resolve(process.cwd(), './node_modules'),
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, './loaders'),
    ],
  },
  resolve: {
    modules: [
      path.resolve(process.cwd(), './node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    filename: `[name].js`,
    path: __dirname,
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Required to load additional languages for Prism
      Prism: 'prismjs',
    }),
    new HtmlWebpackPlugin({title: 'Motion Canvas'}),
    new UIPlugin(cli.flags),
  ],
});

const server = new WebpackDevServer(
  {
    compress: true,
    port: 9000,
    hot: true,
    setupMiddlewares: middlewares => {
      middlewares.unshift({
        name: 'render',
        path: '/render/:name',
        middleware: (req, res) => {
          const stream = fs.createWriteStream(
            path.join(renderOutput, req.params.name),
            {encoding: 'base64'},
          );
          req.pipe(stream);
          req.on('end', () => res.end());
        },
      });

      if (!cli.flags.uiServer) {
        const ui = path.resolve(process.cwd(), cli.flags.uiPath);
        middlewares.unshift({
          name: 'ui',
          path: '/ui/:name',
          middleware: (req, res) => {
            fs.createReadStream(path.join(ui, req.params.name), {
              encoding: 'utf8',
            })
              .on('error', () => res.sendStatus(404))
              .pipe(res);
          },
        });
      }

      return middlewares;
    },
  },
  compiler,
);
server.start().catch(console.error);
