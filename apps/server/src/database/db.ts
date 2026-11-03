import { Kysely, PostgresDialect, sql, type Transaction as KyselyTransaction } from 'kysely';
import pg from 'pg';

import env from '#/env.ts';
import type { DB } from '#/database/types.ts';

// NUMERIC (grades) arrives as a string by default; the values here fit a JS number.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number.parseFloat(value));

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      max: 15,
    }),
  }),
});

export const checkConnection = async () => {
  try {
    await sql`SELECT 1`.execute(db);
    return true;
  } catch {
    return false;
  }
};

export type Transaction = KyselyTransaction<DB>;

export default db;
