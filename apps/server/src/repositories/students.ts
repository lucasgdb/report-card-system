import type { Selectable } from 'kysely';

import db, { type Transaction } from '#/database/db.ts';
import type { Student } from '#/database/types.ts';

export type StudentRow = Selectable<Student>;

export const findStudentsByIds = (ids: readonly number[]) =>
  ids.length ? db.selectFrom('student').selectAll().where('id', 'in', ids).execute() : Promise.resolve([]);

export const findStudentByRM = (rm: string) =>
  db.selectFrom('student').selectAll().where('rm', '=', rm).executeTakeFirst();

export const findStudentsByRMs = (rms: readonly string[]) =>
  rms.length ? db.selectFrom('student').selectAll().where('rm', 'in', rms).execute() : Promise.resolve([]);

export const findStudentByUserId = (userId: number) =>
  db.selectFrom('student').selectAll().where('user_id', '=', userId).executeTakeFirst();

export const listStudents = () => db.selectFrom('student').selectAll().orderBy('fullname').execute();

export const updateStudent = (
  id: number,
  values: Partial<Pick<StudentRow, 'rm' | 'fullname' | 'password_hash' | 'avatar_url'>>
) =>
  db
    .updateTable('student')
    .set({ ...values, updated_at: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow();

/** Removes the student and their user (sessions and report cards go with them). */
export const deleteStudent = (id: number) =>
  db.transaction().execute(async (trx) => {
    const student = await trx.deleteFrom('student').where('id', '=', id).returningAll().executeTakeFirst();
    if (student) {
      await trx.deleteFrom('user').where('id', '=', student.user_id).execute();
    }
    return student;
  });

/** The student with this RM, created (with its user) when it doesn't exist yet. */
export async function findOrCreateStudent(
  trx: Transaction,
  student: Pick<StudentRow, 'rm' | 'fullname'> & { password_hash: () => Promise<string> }
) {
  const existing = await trx.selectFrom('student').selectAll().where('rm', '=', student.rm).executeTakeFirst();
  if (existing) {
    return existing;
  }
  const user = await trx.insertInto('user').defaultValues().returning('id').executeTakeFirstOrThrow();
  return trx
    .insertInto('student')
    .values({
      rm: student.rm,
      fullname: student.fullname,
      password_hash: await student.password_hash(),
      user_id: user.id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
