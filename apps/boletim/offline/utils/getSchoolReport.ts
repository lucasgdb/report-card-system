import type { SchoolReportRowFields } from '~/utils/reportCard';
import { readStudentSnapshot, SCHOOL_REPORT_KEY } from '~/utils/saveSchoolReport';
import { readJSON } from '~/utils/storage';

/** The report card saved by the online app (empty when there's none or it's unreadable). */
export default function getSchoolReport(): SchoolReportRowFields[] {
  const rows = readJSON<SchoolReportRowFields[]>(SCHOOL_REPORT_KEY);
  return Array.isArray(rows) ? rows : [];
}

/** The student the saved report card belongs to; null for reports saved by older versions. */
export const getSavedStudent = readStudentSnapshot;
