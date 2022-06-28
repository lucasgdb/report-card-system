import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import SchoolReportTable from './SchoolReportTable/SchoolReportTable';
import { SchoolReport_schoolReport$key } from './__generated__/SchoolReport_schoolReport.graphql';

const OuterSchoolReport = styled.div`
  padding: 48px 20px;

  @media (min-width: 600px) {
    padding: 64px 8%;
  }
`;

const Title = styled.p`
  font: normal normal 600 24px/30px Lexend;
  color: ${(props) => props.theme.text.title};

  transition: color 0.2s;
  margin: 0;
`;

const SchoolReportWrapper = styled.div`
  overflow-x: auto;

  margin-top: 32px;
`;

type SchoolReportProps = {
  schoolReport: SchoolReport_schoolReport$key;
};

export default function SchoolReport({ schoolReport }: SchoolReportProps) {
  const data = useFragment(
    graphql`
      fragment SchoolReport_schoolReport on SchoolReport {
        ...SchoolReportTable_schoolReport

        schoolReportRows {
          count
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    schoolReport
  );

  if (!data || data.schoolReportRows.count === 0) {
    return (
      <OuterSchoolReport>
        <Title>Não há boletim registrado.</Title>
      </OuterSchoolReport>
    );
  }

  return (
    <OuterSchoolReport>
      <Title>Boletim escolar</Title>

      <SchoolReportWrapper>
        <SchoolReportTable schoolReport={data} />
      </SchoolReportWrapper>
    </OuterSchoolReport>
  );
}
