import type { SchoolReportRowFields } from './reportCard';
import { readJSON, writeStorage } from './storage';

// Keys read by the offline page (offline/utils/getSchoolReport.ts).
export const SCHOOL_REPORT_KEY = 'school_report';
export const STUDENT_KEY = 'school_report_student';

/** Who the saved report card belongs to, shown on the offline page. */
export type StudentSnapshot = {
  RM: string;
  fullname: string;
  firstname: string;
  lastname?: string | null;
  year?: number | null;
  /** ISO date of the last save. */
  savedAt: string;
};

/** Keeps the latest report card for the offline page. */
export default function saveSchoolReport(rows: readonly SchoolReportRowFields[]) {
  writeStorage(SCHOOL_REPORT_KEY, JSON.stringify(rows));
}

export function saveStudentSnapshot(student: Omit<StudentSnapshot, 'savedAt'>) {
  writeStorage(STUDENT_KEY, JSON.stringify({ ...student, savedAt: new Date().toISOString() }));
}

export function readStudentSnapshot() {
  const student = readJSON<StudentSnapshot>(STUDENT_KEY);
  return student && typeof student.fullname === 'string' ? student : null;
}
