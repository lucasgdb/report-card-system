/** One subject of the report card, as returned by the API and saved for the offline page. */
export type SchoolReportRowFields = {
  disciplineName: string;
  firstBimesterGrade?: number | null;
  firstBimesterRecGrade?: number | null;
  firstBimesterAbsences?: number | null;
  secondBimesterGrade?: number | null;
  secondBimesterRecGrade?: number | null;
  secondBimesterAbsences?: number | null;
  thirdBimesterGrade?: number | null;
  thirdBimesterRecGrade?: number | null;
  thirdBimesterAbsences?: number | null;
  fourthBimesterGrade?: number | null;
  fourthBimesterRecGrade?: number | null;
  fourthBimesterAbsences?: number | null;
};

export type Bimester = {
  grade: number | null;
  recovery: number | null;
  absences: number;
};

export type ReportCardRow = {
  subject: string;
  bimesters: Bimester[];
  finalAverage: number;
  totalAbsences: number;
};

const BIMESTERS = ['first', 'second', 'third', 'fourth'] as const;

export function toReportCardRows(rows: readonly SchoolReportRowFields[]): ReportCardRow[] {
  return rows.map((row) => {
    const bimesters = BIMESTERS.map((name) => ({
      grade: row[`${name}BimesterGrade`] ?? null,
      recovery: row[`${name}BimesterRecGrade`] ?? null,
      absences: row[`${name}BimesterAbsences`] ?? 0,
    }));

    // A recovery grade replaces the bimester's grade.
    const finalAverage = bimesters.reduce((sum, { grade, recovery }) => sum + (recovery || grade || 0), 0) / 4;
    const totalAbsences = bimesters.reduce((sum, { absences }) => sum + absences, 0);

    return { subject: row.disciplineName, bimesters, finalAverage, totalAbsences };
  });
}
