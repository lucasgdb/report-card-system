import StudentSummary from '~/components/StudentSummary';
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
            count
            edges {
              node {
                id
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
      approved={data.schoolReport?.schoolReportRows?.count > 0}
    />
  );
}
