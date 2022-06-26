import type { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('bimester').del();
  await knex('school_report_discipline').del();

  const student = await knex('student').select('id').orderBy('id', 'asc').first();

  const [schoolReport] = await knex('school_report').insert({ year: 2022, student_id: student.id }).returning('*');

  const schoolReportDisciplines = await knex('school_report_discipline')
    .insert([
      {
        school_report_id: schoolReport.id,
        discipline_id: 1,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 2,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 3,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 4,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 5,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 6,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 7,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 8,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 9,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 10,
      },
      {
        school_report_id: schoolReport.id,
        discipline_id: 11,
      },
    ])
    .returning('*');

  await knex('bimester').insert([
    ...schoolReportDisciplines.map((schoolReportDiscipline) => ({
      school_report_discipline_id: schoolReportDiscipline.id,
      identifier: 1,
      grade: 10,
      rec_grade: null,
      absences: 0,
    })),
    ...schoolReportDisciplines.map((schoolReportDiscipline) => ({
      school_report_discipline_id: schoolReportDiscipline.id,
      identifier: 2,
      grade: 10,
      rec_grade: null,
      absences: 0,
    })),
    ...schoolReportDisciplines.map((schoolReportDiscipline) => ({
      school_report_discipline_id: schoolReportDiscipline.id,
      identifier: 3,
      grade: 10,
      rec_grade: null,
      absences: 0,
    })),
    ...schoolReportDisciplines.map((schoolReportDiscipline) => ({
      school_report_discipline_id: schoolReportDiscipline.id,
      identifier: 4,
      grade: 10,
      rec_grade: null,
      absences: 0,
    })),
  ]);
};
