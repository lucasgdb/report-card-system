import { fileURLToPath } from 'node:url';

import { defineAppConfig } from '@usefaz/vite-config';
import { defineConfig } from 'vite';

import offlineDevBundle from './offlineDevBundle.ts';

// `vite build` builds the app; `OFFLINE=true vite build` builds the offline page as a single
// `offline.bundle.js`, which the service worker caches as is. The dev server runs that same build in
// watch mode (`offlineDevBundle`), so the offline fallback also works while developing.
const isOfflineBuild = process.env.OFFLINE === 'true';

export default defineConfig(({ mode }) =>
  defineAppConfig({
    root: import.meta.dirname,
    mode,
    port: 8080,
    plugins: isOfflineBuild ? [] : [offlineDevBundle(import.meta.dirname)],
    build: isOfflineBuild
      ? {
          outDir: process.env.OFFLINE_OUT_DIR ?? 'build',
          emptyOutDir: false,
          copyPublicDir: false,
          // A single bundle on purpose: the service worker caches it as one file.
          chunkSizeWarningLimit: 1024,
          rolldownOptions: {
            input: fileURLToPath(new URL('./offline.html', import.meta.url)),
            output: {
              codeSplitting: false,
              entryFileNames: 'offline.bundle.js',
            },
          },
        }
      : undefined,
  })
);
