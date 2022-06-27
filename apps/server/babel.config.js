module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-module-resolver',
      {
        root: ['.'],
        alias: {
          '~': './src',
          '@usefaz/shared': '../../packages/shared/build',
        },
      },
    ],
    '@babel/plugin-proposal-export-default-from',
  ],
};
