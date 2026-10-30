import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  format: 'cjs',
  platform: 'node',
  target: 'node26',
  dts: false,
  deps: {
    // The workspace packages ship TypeScript sources, so they (and their own dependencies,
    // which the server can't resolve on its own) are bundled with the server.
    alwaysBundle: [/^@usefaz\//],
    onlyBundle: false,
  },
});
