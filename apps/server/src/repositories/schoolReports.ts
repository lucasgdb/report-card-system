import type { Selectable } from 'kysely';

import db, { type Transaction } from '#/database/db.ts';
import type { SchoolReport } from '#/database/types.ts';

export type SchoolReportRow = Selectable<SchoolReport>;

/** A bimester's marks; `null` while not given yet. */
export type Bimester = { grade: number | null; recGrade: number | null; absences: number | null };

/** One line of the report card: a discipline and its four bimesters. */
export type ReportCardLine = {
  disciplineId: number;
  disciplineName: string;
  /** Indexed by bimester number (1–4). */
  bimesters: Partial<Record<number, Bimester>>;
};

/** Every discipline, by code (the `discipline_id` of the grades spreadsheet). */
export const listDisciplines = () => db.selectFrom('discipline').select(['id', 'name']).orderBy('id').execute();

export const findSchoolReportsByIds = (ids: readonly number[]) =>
  ids.length ? db.selectFrom('school_report').selectAll().where('id', 'in', ids).execute() : Promise.resolve([]);

/** Each student's most recent school report. */
export const findLatestSchoolReportsByStudentIds = (studentIds: readonly number[]) =>
  studentIds.length
    ? db
        .selectFrom('school_report')
        .distinctOn('student_id')
        .selectAll()
        .where('student_id', 'in', studentIds)
        .orderBy('student_id')
        .orderBy('year', 'desc')
        .execute()
    : Promise.resolve([]);

/** The report card's lines, one per discipline, in discipline order. */
export async function findReportCardLines(schoolReportId: number) {
  const rows = await db
    .selectFrom('school_report_discipline as srd')
    .innerJoin('discipline', 'discipline.id', 'srd.discipline_id')
    .innerJoin('bimester', 'bimester.school_report_discipline_id', 'srd.id')
    .select([
      'discipline.id as disciplineId',
      'discipline.name as disciplineName',
      'bimester.number',
      'bimester.grade',
      'bimester.rec_grade',
      'bimester.absences',
    ])
    .where('srd.school_report_id', '=', schoolReportId)
    .orderBy('discipline.id')
    .orderBy('bimester.number')
    .execute();

  const lines = new Map<number, ReportCardLine>();
  for (const row of rows) {
    const line = lines.get(row.disciplineId) ?? {
      disciplineId: row.disciplineId,
      disciplineName: row.disciplineName,
      bimesters: {},
    };
    line.bimesters[row.number] = {
      grade: row.grade,
      recGrade: row.rec_grade,
      absences: row.absences,
    };
    lines.set(row.disciplineId, line);
  }
  return [...lines.values()];
}

/**
 * Saves a discipline's four bimesters in the student's report card for the year, creating what's missing and
 * replacing what was there (an empty value clears it). Other disciplines are left as they are.
 */
export async function saveReportCardLine(
  trx: Transaction,
  {
    studentId,
    year,
    disciplineId,
    bimesters,
  }: { studentId: number; year: number; disciplineId: number; bimesters: Bimester[] }
) {
  const schoolReport =
    (await trx
      .selectFrom('school_report')
      .select('id')
      .where('student_id', '=', studentId)
      .where('year', '=', year)
      .executeTakeFirst()) ??
    (await trx
      .insertInto('school_report')
      .values({ student_id: studentId, year })
      .returning('id')
      .executeTakeFirstOrThrow());

  const discipline = await trx
    .insertInto('school_report_discipline')
    .values({ school_report_id: schoolReport.id, discipline_id: disciplineId })
    .onConflict((conflict) =>
      conflict
        .columns(['school_report_id', 'discipline_id'])
        .doUpdateSet((eb) => ({ discipline_id: eb.ref('excluded.discipline_id') }))
    )
    .returning('id')
    .executeTakeFirstOrThrow();

  await trx
    .insertInto('bimester')
    .values(
      bimesters.map((bimester, index) => ({
        school_report_discipline_id: discipline.id,
        number: index + 1,
        grade: bimester.grade,
        rec_grade: bimester.recGrade,
        absences: bimester.absences,
      }))
    )
    .onConflict((conflict) =>
      conflict.columns(['school_report_discipline_id', 'number']).doUpdateSet((eb) => ({
        grade: eb.ref('excluded.grade'),
        rec_grade: eb.ref('excluded.rec_grade'),
        absences: eb.ref('excluded.absences'),
        updated_at: new Date(),
      }))
    )
    .execute();
}
