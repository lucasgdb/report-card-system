import { sql } from 'kysely';
import { Migrator } from 'kysely/migration';

import db from '#/database/db.ts';
import migrations from '#/database/migrations/index.ts';
import { seed } from '#/database/seed.ts';
import { isDev } from '#/env.ts';
import logger from '#/logger.ts';

/** Development only: drops everything, runs the migrations and seeds the test data. */
if (!isDev) {
  logger.error('db:reset only runs with NODE_ENV=DEVELOPMENT');
  process.exit(1);
}

await sql`DROP SCHEMA public CASCADE`.execute(db);
await sql`CREATE SCHEMA public`.execute(db);

const { error } = await new Migrator({ db, provider: { getMigrations: async () => migrations } }).migrateToLatest();
if (error) {
  logger.error(error, 'migration failed');
  process.exit(1);
}

await seed();
await db.destroy();
