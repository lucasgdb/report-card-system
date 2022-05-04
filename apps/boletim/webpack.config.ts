import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  entry: {
    app: './src/index.tsx',
    offline: {
      import: './offline/index.tsx',
      filename: 'offline.bundle.js',
    },
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    asyncChunks: true,
    clean: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  watchOptions: {
    ignored: ['**/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      path: path.resolve(__dirname, 'public'),
      filename: 'index.html',
      chunks: ['app'],
    }),

    new HtmlWebpackPlugin({
      template: './public/offline.html',
      path: path.resolve(__dirname, 'public'),
      filename: 'offline.html',
      chunks: ['offline'],
    }),

    new CopyWebpackPlugin({
      options: { concurrency: 200 },
      patterns: [
        {
          from: './public/assets',
          to: 'assets',
          noErrorOnMissing: true,
        },
        { from: './public/manifest.json', to: 'manifest.json' },
        { from: './src/serviceWorker.js', to: 'serviceWorker.js' },
      ],
    }),
  ],
};

export default config;
