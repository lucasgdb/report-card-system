import 'webpack-dev-server';

import { merge } from 'webpack-merge';
import WebpackBeforeBuildPlugin from 'before-build-webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import DotEnv from 'dotenv-webpack';
import path from 'path';
import execa from 'execa';

import webpackConfig from './webpack.config';

const config = merge(webpackConfig, {
  mode: 'development',
  devtool: 'eval',
  cache: true,
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    client: {
      overlay: true,
      progress: false,
    },
    compress: true,
    allowedHosts: 'all',
    historyApiFallback: true,
    hot: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new DotEnv({
      path: '.env.development',
      safe: true,
      silent: true,
    }),

    new WebpackBeforeBuildPlugin(
      async (_stats: unknown, stop: () => void) => {
        try {
          const { stdout } = await execa('yarn', ['relay']);
          console.info(stdout, '\n');
        } catch (err) {
          console.error(err);
        } finally {
          stop();
        }
      },
      ['run', 'watch-run']
    ),

    new ReactRefreshWebpackPlugin(),
  ],
});

export default config;
