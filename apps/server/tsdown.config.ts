import { defineConfig } from 'tsdown';

export default defineConfig({
  // The API and the migration runner (which `pnpm start` runs first).
  entry: { index: 'src/index.ts', migrate: 'src/database/migrate.ts' },
  outDir: 'build',
  format: 'esm',
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
