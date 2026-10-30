import { graphql, useFragment } from 'react-relay';

import ReportCardSection, { ReportCardEmpty } from '~/components/ReportCardSection';
import SchoolReportTable from './SchoolReportTable/SchoolReportTable';
import type { SchoolReport_schoolReport$key } from './__generated__/SchoolReport_schoolReport.graphql';

type SchoolReportProps = {
  schoolReport: SchoolReport_schoolReport$key;
};

export default function SchoolReport({ schoolReport }: SchoolReportProps) {
  const data = useFragment(
    graphql`
      fragment SchoolReport_schoolReport on SchoolReport {
        year

        ...SchoolReportTable_schoolReport

        schoolReportRows {
          count
        }
      }
    `,
    schoolReport
  );

  if (!data || data.schoolReportRows.count === 0) {
    return (
      <ReportCardEmpty
        title="Seu boletim ainda não foi publicado"
        description="As notas aparecem aqui assim que a escola lançá-las. Em caso de dúvida, fale com a secretaria."
      />
    );
  }

  return (
    <ReportCardSection>
      <SchoolReportTable schoolReport={data} year={data.year} />
    </ReportCardSection>
  );
}
