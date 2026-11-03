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

/** A bimester's marks; `null` while the school hasn't given them yet. */
export type Bimester = {
  grade: number | null;
  recovery: number | null;
  absences: number | null;
};

export type ReportCardRow = {
  subject: string;
  bimesters: Bimester[];
  /** Average of the four bimesters; `null` until all of them have a grade. */
  finalAverage: number | null;
  /** `null` while no bimester has absences given. */
  totalAbsences: number | null;
};

const BIMESTERS = ['first', 'second', 'third', 'fourth'] as const;

/** Passing marks, the same the report card colors by. */
export const PASSING_AVERAGE = 7;
export const ABSENCE_LIMIT = 18;

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function toReportCardRows(rows: readonly SchoolReportRowFields[]): ReportCardRow[] {
  return rows.map((row) => {
    const bimesters = BIMESTERS.map((name) => ({
      grade: row[`${name}BimesterGrade`] ?? null,
      recovery: row[`${name}BimesterRecGrade`] ?? null,
      absences: row[`${name}BimesterAbsences`] ?? null,
    }));

    // A recovery grade replaces the bimester's grade. No average until every bimester is graded.
    const grades = bimesters.flatMap(({ grade, recovery }) => recovery ?? grade ?? []);
    const absences = bimesters.flatMap(({ absences }) => absences ?? []);

    return {
      subject: row.disciplineName,
      bimesters,
      finalAverage: grades.length === bimesters.length ? sum(grades) / grades.length : null,
      totalAbsences: absences.length ? sum(absences) : null,
    };
  });
}

/** Approved once every grade of the year is in, with every average and absence count within the limits. */
export function isApproved(rows: readonly ReportCardRow[]) {
  return (
    rows.length > 0 &&
    rows.every(
      (row) =>
        row.finalAverage !== null &&
        Math.round(row.finalAverage * 10) / 10 >= PASSING_AVERAGE &&
        (row.totalAbsences ?? 0) < ABSENCE_LIMIT
    )
  );
}
