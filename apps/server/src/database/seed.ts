import { hashPassword } from '#/auth/password.ts';
import db from '#/database/db.ts';
import logger from '#/logger.ts';

/** Test data: one student with this year's report card, one admin and the disciplines. */
export const TEST_LOGINS = {
  student: { RM: '12345', password: 'usefaz123' },
  admin: { email: 'lucasgdbittencourt@gmail.com', password: 'usefaz123' },
};

const DISCIPLINES = [
  'Língua Portuguesa',
  'Inglês',
  'Espanhol',
  'Informática',
  'Artes',
  'Educação Física',
  'Ciências',
  'Matemática',
  'História',
  'Geografia',
  'Filosofia e Ética',
];

export async function seed() {
  await db.transaction().execute(async (trx) => {
    const disciplines = await trx
      .insertInto('discipline')
      .values(DISCIPLINES.map((name) => ({ name })))
      .returning('id')
      .execute();

    const studentUser = await trx.insertInto('user').defaultValues().returning('id').executeTakeFirstOrThrow();
    const student = await trx
      .insertInto('student')
      .values({
        user_id: studentUser.id,
        rm: TEST_LOGINS.student.RM,
        fullname: 'Lucas Bittencourt',
        password_hash: await hashPassword(TEST_LOGINS.student.password),
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const schoolReport = await trx
      .insertInto('school_report')
      .values({ student_id: student.id, year: new Date().getFullYear() })
      .returning('id')
      .executeTakeFirstOrThrow();

    const reportDisciplines = await trx
      .insertInto('school_report_discipline')
      .values(disciplines.map(({ id }) => ({ school_report_id: schoolReport.id, discipline_id: id })))
      .returning('id')
      .execute();

    await trx
      .insertInto('bimester')
      .values(
        reportDisciplines.flatMap(({ id }) =>
          [1, 2, 3, 4].map((number) => ({ school_report_discipline_id: id, number, grade: 10, absences: 0 }))
        )
      )
      .execute();

    const adminUser = await trx.insertInto('user').defaultValues().returning('id').executeTakeFirstOrThrow();
    await trx
      .insertInto('admin')
      .values({
        user_id: adminUser.id,
        fullname: 'Lucas Bittencourt',
        email: TEST_LOGINS.admin.email,
        password_hash: await hashPassword(TEST_LOGINS.admin.password),
      })
      .execute();
  });

  logger.info(TEST_LOGINS, 'seeded test data');
}

if (import.meta.main) {
  await seed();
  await db.destroy();
}
