import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { isDev } from '#/env.ts';
import logger from '#/logger.ts';
import { ROOT_DIR } from '#/paths.ts';

/**
 * Persisted operations: each app's relay-compiler writes the operations it uses to
 * `persisted-operations/<app>.json` (`{ "<id>": "<query text>" }`), and clients send only the id.
 * In production the API runs nothing else, which rules out arbitrary or abusive queries.
 */
const DIR = path.join(ROOT_DIR, 'persisted-operations');

let operations = new Map<string, string>();

async function load() {
  const files = (await readdir(DIR).catch(() => [])).filter((file) => file.endsWith('.json'));
  const next = new Map<string, string>();
  for (const file of files) {
    const entries = JSON.parse(await readFile(path.join(DIR, file), 'utf8')) as Record<string, string>;
    for (const [id, text] of Object.entries(entries)) {
      next.set(id, text);
    }
  }
  operations = next;
  logger.info({ count: next.size }, 'persisted operations loaded');
}

await load();

/** The query text for an id. In development, unknown ids reload the files (relay-compiler rewrites them). */
export async function getPersistedOperation(id: string) {
  if (!operations.has(id) && isDev) {
    await load();
  }
  return operations.get(id) ?? null;
}
