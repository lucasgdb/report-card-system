import { sql, type Selectable } from 'kysely';

import db from '#/database/db.ts';
import type { Admin } from '#/database/types.ts';

export type AdminRow = Selectable<Admin>;

export const findAdminById = (id: number) => db.selectFrom('admin').selectAll().where('id', '=', id).executeTakeFirst();

export const findAdminByUserId = (userId: number) =>
  db.selectFrom('admin').selectAll().where('user_id', '=', userId).executeTakeFirst();

/** Exact e-mail match, ignoring case. */
export const findAdminByEmail = (email: string) =>
  db
    .selectFrom('admin')
    .selectAll()
    .where(sql<string>`lower(email)`, '=', email.trim().toLowerCase())
    .executeTakeFirst();

export const updateAdminPassword = (id: number, passwordHash: string) =>
  db.updateTable('admin').set({ password_hash: passwordHash, updated_at: new Date() }).where('id', '=', id).execute();
