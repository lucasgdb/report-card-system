import StudentSummary from '~/components/StudentSummary';

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
      approved={getSchoolReport().length > 0}
    />
  );
}
