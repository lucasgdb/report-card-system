import { Migrator } from 'kysely/migration';

import db from '#/database/db.ts';
import migrations from '#/database/migrations/index.ts';
import logger from '#/logger.ts';

/** `migrate.ts latest` applies pending migrations; `migrate.ts down` reverts the last one. */
const direction = process.argv[2] === 'down' ? 'down' : 'latest';

const migrator = new Migrator({
  db,
  provider: { getMigrations: async () => migrations },
});

const { error, results } = direction === 'down' ? await migrator.migrateDown() : await migrator.migrateToLatest();

for (const result of results ?? []) {
  const log = result.status === 'Error' ? logger.error.bind(logger) : logger.info.bind(logger);
  log(`migration ${result.migrationName} (${result.direction}): ${result.status}`);
}

await db.destroy();

if (error) {
  logger.error(error, 'migration failed');
  process.exit(1);
}
