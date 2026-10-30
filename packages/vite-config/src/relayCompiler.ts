import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { Plugin } from 'vite';

const SOURCE_FILE = /\.[jt]sx?$/;

/**
 * Runs `relay-compiler` before the build and again whenever a source file changes on the dev server.
 *
 * `relay-compiler --watch` (what vite-plugin-relay-lite runs) needs watchman, which the dev containers
 * don't have. A full compile takes a fraction of a second, so recompiling on change is enough.
 */
export default function relayCompiler(root: string): Plugin {
  // The `relay-compiler` package resolves to the native binary for this platform.
  const binary: string = createRequire(path.join(root, 'package.json'))('relay-compiler');
  const sourceDir = path.join(root, 'src') + path.sep;

  let running = false;
  let pending = false;

  const compileInBackground = () => {
    if (running) {
      pending = true;
      return;
    }

    running = true;
    spawn(binary, [], { cwd: root, stdio: 'inherit' }).on('exit', () => {
      running = false;
      if (pending) {
        pending = false;
        compileInBackground();
      }
    });
  };

  return {
    name: 'usefaz:relay-compiler',

    buildStart() {
      // Set by a build the dev server starts itself (the offline page), while it compiles on its own.
      if (process.env.SKIP_RELAY_COMPILER === 'true') {
        return;
      }
      const { status } = spawnSync(binary, [], { cwd: root, stdio: 'inherit' });
      if (status !== 0 && this.environment.mode === 'build') {
        this.error('relay-compiler failed');
      }
    },

    configureServer(server) {
      const onFileEvent = (file: string) => {
        if (file.startsWith(sourceDir) && SOURCE_FILE.test(file) && !file.includes('__generated__')) {
          compileInBackground();
        }
      };

      server.watcher.on('add', onFileEvent);
      server.watcher.on('change', onFileEvent);
      server.watcher.on('unlink', onFileEvent);
    },
  };
}
