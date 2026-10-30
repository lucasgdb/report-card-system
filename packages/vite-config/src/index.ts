import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import type { UserConfig } from 'vite';
import relay from 'vite-plugin-relay-lite';

import relayCompiler from './relayCompiler.ts';

// The apps and the shared packages read their settings from `process.env`, so the variables
// from `.env.<mode>` are inlined at build time.
const ENV_KEYS = ['SERVER_BASE_URL', 'AUTHORIZATION_HEADER', 'RECAPTCHA_V3_PUBLIC_TOKEN'];

type AppConfigOptions = {
  /** The app's folder, usually `import.meta.dirname`. */
  root: string;
  mode: string;
  port: number;
  build?: UserConfig['build'];
};

export function defineAppConfig({ root, mode, port, build }: AppConfigOptions): UserConfig {
  const env = loadEnv(mode, root, '');

  return {
    plugins: [react(), tailwindcss(), relayCompiler(root), relay({ codegen: false })],
    resolve: {
      alias: {
        '~': path.join(root, 'src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
      ...Object.fromEntries(ENV_KEYS.map((key) => [`process.env.${key}`, JSON.stringify(env[key])])),
    },
    server: {
      host: true,
      port,
      strictPort: true,
    },
    preview: {
      port,
    },
    build: {
      outDir: 'build',
      ...build,
    },
  };
}
