#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import meow from 'meow';
import UIPlugin from './plugins/UIPlugin.mjs';
import {createRequire} from 'module';

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

if (cli.flags.uiServer) {
  cli.flags.uiPath ||= 'http://localhost:9001/main.js';
} else {
  if (cli.flags.uiPath) {
    cli.flags.uiPath = path.resolve(process.cwd(), cli.flags.uiPath);
  } else {
    const require = createRequire(import.meta.url);
    cli.flags.uiPath = path.dirname(require.resolve('@motion-canvas/ui'));
  }
}

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
    modules: ['node_modules', path.resolve(__dirname, './loaders')],
  },
  resolve: {
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
    static: [
      {
        directory: path.join(__dirname, '../api'),
        publicPath: '/api',
        watch: false,
      },
    ],
    setupMiddlewares: middlewares => {
      middlewares.unshift({
        name: 'render',
        path: '/render/:name',
        middleware: (req, res) => {
          const file = path.join(renderOutput, req.params.name);
          const directory = path.dirname(file);
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {recursive: true});
          }
          const stream = fs.createWriteStream(file, {encoding: 'base64'});
          req.pipe(stream);
          req.on('end', () => res.end());
        },
      });

      if (!cli.flags.uiServer) {
        middlewares.unshift({
          name: 'ui',
          path: '/ui/:name',
          middleware: (req, res) => {
            fs.createReadStream(path.join(cli.flags.uiPath, req.params.name), {
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
