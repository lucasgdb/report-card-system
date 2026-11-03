import { encodeGlobalID, resolveArrayConnection } from '@pothos/plugin-relay';

import builder, { orderByIds, toRowIds } from '#/graphql/builder.ts';
import {
  findReportCardLines,
  findSchoolReportsByIds,
  type ReportCardLine,
  type SchoolReportRow,
} from '#/repositories/schoolReports.ts';

const BIMESTERS = { first: 1, second: 2, third: 3, fourth: 4 } as const;

/** One discipline of the report card with its four bimesters. */
const SchoolReportRowRef = builder.objectRef<ReportCardLine>('SchoolReportRowType').implement({
  fields: (t) => ({
    id: t.id({ resolve: (line) => encodeGlobalID('Discipline', line.disciplineId) }),
    disciplineName: t.exposeString('disciplineName'),
    disciplineCode: t.int({ resolve: (line) => line.disciplineId }),
    // Grades and absences are null while not given yet.
    ...Object.fromEntries(
      Object.entries(BIMESTERS).flatMap(([name, identifier]) => [
        [
          `${name}BimesterGrade`,
          t.float({ nullable: true, resolve: (line) => line.bimesters[identifier]?.grade ?? null }),
        ],
        [
          `${name}BimesterRecGrade`,
          t.float({ nullable: true, resolve: (line) => line.bimesters[identifier]?.recGrade ?? null }),
        ],
        [
          `${name}BimesterAbsences`,
          t.int({ nullable: true, resolve: (line) => line.bimesters[identifier]?.absences ?? null }),
        ],
      ])
    ),
  }),
});

const SchoolReportRowConnection = builder.connectionObject(
  {
    type: SchoolReportRowRef,
    name: 'SchoolReportRowConnection',
    // The number of items in this page of the connection.
    fields: (t) => ({
      count: t.int({ resolve: (connection) => (Array.isArray(connection.edges) ? connection.edges.length : 0) }),
    }),
  },
  { name: 'SchoolReportRowEdge' }
);

export const SchoolReportRef = builder.objectRef<SchoolReportRow>('SchoolReport');

builder.node(SchoolReportRef, {
  id: { resolve: (schoolReport) => schoolReport.id },
  // Admins see any report card; a student only their own.
  loadMany: async (ids, ctx) => {
    const viewer = ctx.viewer;
    if (!viewer?.admin && !viewer?.student) {
      return ids.map(() => null);
    }
    const rows = await findSchoolReportsByIds(toRowIds(ids));
    return orderByIds(ids, rows).map((row) =>
      row && (viewer.admin || row.student_id === viewer.student?.id) ? row : null
    );
  },
  fields: (t) => ({
    year: t.exposeInt('year'),
    schoolReportRows: t.connection(
      {
        type: SchoolReportRowRef,
        nullable: true,
        resolve: async (schoolReport, args) =>
          resolveArrayConnection({ args }, await findReportCardLines(schoolReport.id)),
      },
      SchoolReportRowConnection
    ),
  }),
});
