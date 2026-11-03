import builder, { orderByIds, toRowIds } from '#/graphql/builder.ts';
import { SchoolReportRef } from '#/graphql/types/schoolReport.ts';
import { firstName, lastName } from '#/graphql/types/shared.ts';
import { findLatestSchoolReportsByStudentIds } from '#/repositories/schoolReports.ts';
import { findStudentsByIds, type StudentRow } from '#/repositories/students.ts';

export const StudentRef = builder.objectRef<StudentRow>('Student');

builder.node(StudentRef, {
  id: { resolve: (student) => student.id },
  // Admins see any student; a student only themselves.
  loadMany: async (ids, ctx) => {
    const viewer = ctx.viewer;
    if (viewer?.admin) {
      return orderByIds(ids, await findStudentsByIds(toRowIds(ids)));
    }
    return ids.map((id) => (viewer?.student && String(viewer.student.id) === id ? viewer.student : null));
  },
  fields: (t) => ({
    RM: t.exposeString('rm'),
    firstname: t.string({ resolve: (student) => firstName(student.fullname) }),
    lastname: t.string({ nullable: true, resolve: (student) => lastName(student.fullname) }),
    fullname: t.exposeString('fullname'),
    avatarURL: t.string({ nullable: true, resolve: (student) => student.avatar_url }),
    // Batched: a list of students loads all their report cards in one query.
    schoolReport: t.loadable({
      type: SchoolReportRef,
      nullable: true,
      load: async (studentIds: number[]) => {
        const reports = await findLatestSchoolReportsByStudentIds(studentIds);
        const byStudent = new Map(reports.map((report) => [report.student_id, report]));
        return studentIds.map((id) => byStudent.get(id) ?? null) as never;
      },
      resolve: (student) => student.id,
    }),
  }),
});
