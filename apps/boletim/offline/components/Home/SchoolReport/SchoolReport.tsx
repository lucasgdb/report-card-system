import styled from 'styled-components';

import getSchoolReport from '../../../utils/getSchoolReport';
import SchoolReportTable from './SchoolReportTable/SchoolReportTable';

const OuterSchoolReport = styled.div`
  padding: 48px 20px;

  @media (min-width: 600px) {
    padding: 64px 8%;
  }
`;

const Title = styled.p`
  font: normal normal 600 24px/30px Lexend;
  color: #494d4b;

  margin: 0;
`;

const SchoolReportWrapper = styled.div`
  overflow-x: auto;

  margin-top: 32px;
`;

export default function SchoolReport() {
  const schoolReport = getSchoolReport();

  if (schoolReport.length === 0) {
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
        <SchoolReportTable />
      </SchoolReportWrapper>
    </OuterSchoolReport>
  );
}
