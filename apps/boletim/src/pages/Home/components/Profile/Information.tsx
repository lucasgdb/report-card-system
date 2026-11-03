import StudentSummary from '~/components/StudentSummary';
import { isApproved, toReportCardRows } from '~/utils/reportCard';
import { graphql, useFragment } from 'react-relay';

import type { Information_student$key } from './__generated__/Information_student.graphql';

type InformationProps = {
  student: Information_student$key;
};

export default function Information({ student }: InformationProps) {
  const data = useFragment<Information_student$key>(
    graphql`
      fragment Information_student on Student {
        RM
        fullname

        schoolReport {
          year

          schoolReportRows {
            edges {
              node {
                disciplineName
                firstBimesterGrade
                firstBimesterRecGrade
                firstBimesterAbsences
                secondBimesterGrade
                secondBimesterRecGrade
                secondBimesterAbsences
                thirdBimesterGrade
                thirdBimesterRecGrade
                thirdBimesterAbsences
                fourthBimesterGrade
                fourthBimesterRecGrade
                fourthBimesterAbsences
              }
            }
          }
        }
      }
    `,
    student
  );

  return (
    <StudentSummary
      RM={data.RM}
      fullname={data.fullname}
      year={data.schoolReport?.year}
      approved={isApproved(
        toReportCardRows((data.schoolReport?.schoolReportRows?.edges ?? []).map(({ node }) => node))
      )}
    />
  );
}
