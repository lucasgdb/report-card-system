import styled from 'styled-components';

import SchoolReport from './SchoolReport/SchoolReport';

const OuterBoletim = styled.div`
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
