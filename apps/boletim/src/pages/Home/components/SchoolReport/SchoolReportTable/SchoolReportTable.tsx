import { useEffect, useMemo } from 'react';
import { graphql, useFragment } from 'react-relay';

import ReportCardTable from '~/components/ReportCardTable';
import { toReportCardRows } from '~/utils/reportCard';
import saveSchoolReport from '~/utils/saveSchoolReport';
import type { SchoolReportTable_schoolReport$key } from './__generated__/SchoolReportTable_schoolReport.graphql';

type SchoolReportTableProps = {
  schoolReport: SchoolReportTable_schoolReport$key;
  year?: number | null;
};

export default function SchoolReportTable({ schoolReport, year }: SchoolReportTableProps) {
  const data = useFragment(
    graphql`
      fragment SchoolReportTable_schoolReport on SchoolReport {
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
    `,
    schoolReport
  );

  const rows = useMemo(() => data.schoolReportRows.edges.map(({ node }) => node), [data]);

  useEffect(() => {
    saveSchoolReport(rows);
  }, [rows]);

  return <ReportCardTable rows={toReportCardRows(rows)} year={year} />;
}
