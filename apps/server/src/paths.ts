import path from 'node:path';

// Both `src` (dev) and `build` (bundled) sit right under the server's root folder.
export const ROOT_DIR = path.resolve(__dirname, '..');

export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
