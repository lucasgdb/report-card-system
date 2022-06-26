export default function getSchoolReport() {
  const lsSchoolReport = localStorage.getItem('school_report');
  if (!lsSchoolReport) {
    return [];
  }

  const schoolReport = JSON.parse(lsSchoolReport);
  return schoolReport;
}
