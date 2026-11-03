import path from 'node:path';

// `src/` in development and `build/` in production: both sit right inside the server folder.
export const ROOT_DIR = path.resolve(import.meta.dirname, '..');

/** Files served at `/public` (avatars when STORAGE_DRIVER=local). */
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
