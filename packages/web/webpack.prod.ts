/* eslint-disable import/no-extraneous-dependencies */
import { merge } from 'webpack-merge';
import DotEnv from 'dotenv-webpack';

import webpackConfig from './webpack.config';

const config = merge(webpackConfig, {
  mode: 'production',
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader?cacheDirectory',
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new DotEnv({
      path: '.env.production',
      safe: true,
      silent: true,
    }),
  ],
});

export default config;
