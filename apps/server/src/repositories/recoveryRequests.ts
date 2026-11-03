import { sql, type Selectable } from 'kysely';

import db from '#/database/db.ts';
import type { AdminPasswordReset, StudentPasswordRecoveryRequest } from '#/database/types.ts';

export type StudentRecoveryRequestRow = Selectable<StudentPasswordRecoveryRequest>;
export type AdminPasswordResetRow = Selectable<AdminPasswordReset>;

/** Password reset links are valid for 3 days. */
const LINK_LIFETIME_MS = 3 * 24 * 60 * 60 * 1000;

const linkExpiry = () => new Date(Date.now() + LINK_LIFETIME_MS);

// Students ---------------------------------------------------------------------------------------

export const findStudentRequestsByIds = (ids: readonly number[]) =>
  ids.length
    ? db.selectFrom('student_password_recovery_request').selectAll().where('id', 'in', ids).execute()
    : Promise.resolve([]);

export const findStudentRequestById = (id: number) =>
  db.selectFrom('student_password_recovery_request').selectAll().where('id', '=', id).executeTakeFirst();

/** Waiting for the admin first, then waiting for the student, then the finished ones; newest first. */
export const listStudentRequests = () =>
  db
    .selectFrom('student_password_recovery_request')
    .selectAll()
    .orderBy(sql`CASE status WHEN 'PENDING' THEN 0 WHEN 'LINK_SENT' THEN 1 WHEN 'CHANGED' THEN 2 ELSE 3 END`)
    .orderBy('created_at', 'desc')
    .execute();

/** Requests still waiting for an admin. */
export const countPendingStudentRequests = async () => {
  const { count } = await db
    .selectFrom('student_password_recovery_request')
    .select((eb) => eb.fn.countAll<number>().as('count'))
    .where('status', '=', 'PENDING')
    .executeTakeFirstOrThrow();
  return Number(count);
};

export const refuseStudentRequest = (id: number) =>
  db
    .updateTable('student_password_recovery_request')
    .set({ status: 'REFUSED', token_hash: null, expires_at: null, updated_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

export const setStudentRequestLink = (id: number, tokenHash: string) =>
  db
    .updateTable('student_password_recovery_request')
    .set({ status: 'LINK_SENT', token_hash: tokenHash, expires_at: linkExpiry(), updated_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

/** A request whose link can still be used: sent, same token, not expired. */
export const findUsableStudentRequest = (id: number, tokenHash: string) =>
  db
    .selectFrom('student_password_recovery_request')
    .selectAll()
    .where('id', '=', id)
    .where('status', '=', 'LINK_SENT')
    .where('token_hash', '=', tokenHash)
    .where('expires_at', '>', new Date())
    .executeTakeFirst();

export const completeStudentRequest = (id: number) =>
  db
    .updateTable('student_password_recovery_request')
    .set({ status: 'CHANGED', token_hash: null, expires_at: null, updated_at: new Date() })
    .where('id', '=', id)
    .execute();

// Admins -----------------------------------------------------------------------------------------

export const findAdminResetsByIds = (ids: readonly number[]) =>
  ids.length ? db.selectFrom('admin_password_reset').selectAll().where('id', 'in', ids).execute() : Promise.resolve([]);

export const createAdminReset = (adminId: number, tokenHash: string) =>
  db
    .insertInto('admin_password_reset')
    .values({ admin_id: adminId, token_hash: tokenHash, expires_at: linkExpiry() })
    .returningAll()
    .executeTakeFirstOrThrow();

/** A reset link that can still be used: unused, same token, not expired. */
export const findUsableAdminReset = (id: number, tokenHash: string) =>
  db
    .selectFrom('admin_password_reset')
    .selectAll()
    .where('id', '=', id)
    .where('token_hash', '=', tokenHash)
    .where('used_at', 'is', null)
    .where('expires_at', '>', new Date())
    .executeTakeFirst();

export const markAdminResetUsed = (id: number) =>
  db
    .updateTable('admin_password_reset')
    .set({ used_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();
