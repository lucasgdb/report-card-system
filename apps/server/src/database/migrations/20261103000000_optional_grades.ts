import { type Kysely, sql } from 'kysely';

/** A bimester may have no grade or absences yet (students uploaded at the start of the year, grades still missing). */
export async function up(db: Kysely<unknown>) {
  await sql`ALTER TABLE bimester ALTER COLUMN grade DROP NOT NULL`.execute(db);
  await sql`ALTER TABLE bimester ALTER COLUMN absences DROP NOT NULL, ALTER COLUMN absences DROP DEFAULT`.execute(db);
}

export async function down(db: Kysely<unknown>) {
  await sql`DELETE FROM bimester WHERE grade IS NULL`.execute(db);
  await sql`UPDATE bimester SET absences = 0 WHERE absences IS NULL`.execute(db);
  await sql`ALTER TABLE bimester ALTER COLUMN grade SET NOT NULL`.execute(db);
  await sql`ALTER TABLE bimester ALTER COLUMN absences SET NOT NULL, ALTER COLUMN absences SET DEFAULT 0`.execute(db);
}
