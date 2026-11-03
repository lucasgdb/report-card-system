import StudentSummary from '~/components/StudentSummary';
import { isApproved, toReportCardRows } from '~/utils/reportCard';

import getSchoolReport, { getSavedStudent } from '../../../../utils/getSchoolReport';

export default function Information() {
  const student = getSavedStudent();
  if (!student) {
    return null;
  }

  return (
    <StudentSummary
      RM={student.RM}
      fullname={student.fullname}
      year={student.year}
      approved={isApproved(toReportCardRows(getSchoolReport()))}
    />
  );
}
