import { fileURLToPath } from 'node:url';

import { defineAppConfig } from '@usefaz/vite-config';
import { defineConfig } from 'vite';

// `vite build` builds the app; `OFFLINE=true vite build` builds the offline page as a single
// `offline.bundle.js`, which the service worker caches as is.
const isOfflineBuild = process.env.OFFLINE === 'true';

export default defineConfig(({ mode }) =>
  defineAppConfig({
    root: import.meta.dirname,
    mode,
    port: 8080,
    build: isOfflineBuild
      ? {
          emptyOutDir: false,
          copyPublicDir: false,
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
