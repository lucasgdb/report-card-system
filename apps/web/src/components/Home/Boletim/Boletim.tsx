import styled from 'styled-components';

import SchoolReport from './SchoolReport';

const OuterBoletim = styled.div`
  padding: 64px 8%;
`;

const Title = styled.p`
  font: normal normal 600 24px/30px Lexend;
  color: #494d4b;
`;

const SchoolReportWrapper = styled.div`
  overflow-x: auto;
`;

export default function Boletim() {
  return (
    <OuterBoletim>
      <Title>Boletim escolar</Title>

      <SchoolReportWrapper>
        <SchoolReport />
      </SchoolReportWrapper>
    </OuterBoletim>
  );
}
