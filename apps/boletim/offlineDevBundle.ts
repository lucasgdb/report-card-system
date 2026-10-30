import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

const FILES: Record<string, string> = {
  '/offline.html': 'text/html; charset=utf-8',
  '/offline.bundle.js': 'text/javascript; charset=utf-8',
};

/**
 * Makes the offline fallback work on the dev server too. The service worker caches `/offline.html`
 * and `/offline.bundle.js`, which only a build produces, so this runs the production offline build
 * (`OFFLINE=true vite build`) in watch mode and serves those two files from it.
 */
export default function offlineDevBundle(root: string): Plugin {
  const outDir = path.join(root, 'node_modules/.offline-dev');

  return {
    name: 'usefaz:offline-dev-bundle',
    apply: 'serve',

    configureServer(server) {
      let markReady = () => {};
      const ready = new Promise<void>((resolve) => {
        markReady = resolve;
      });

      const child = spawn(
        process.execPath,
        [path.join(root, 'node_modules/vite/bin/vite.js'), 'build', '--watch', '--mode', server.config.mode],
        {
          cwd: root,
          // The dev server already runs relay-compiler on change.
          env: { ...process.env, OFFLINE: 'true', OFFLINE_OUT_DIR: outDir, SKIP_RELAY_COMPILER: 'true' },
          stdio: ['ignore', 'pipe', 'inherit'],
        }
      );
      child.stdout.on('data', (chunk: Buffer) => {
        if (chunk.toString().includes('built in')) {
          markReady();
        }
      });
      server.httpServer?.on('close', () => child.kill());

      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        const contentType = FILES[pathname];
        if (!contentType) {
          next();
          return;
        }

        ready.then(() => {
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'no-cache');
          fs.createReadStream(path.join(outDir, pathname))
            .on('error', () => {
              res.statusCode = 404;
              res.end();
            })
            .pipe(res);
        });
      });
    },
  };
}
