module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['relay', { schema: '../server/schema.graphql' }],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-export-default-from',
    ['babel-plugin-styled-components', { ssr: false }],
  ],
};
