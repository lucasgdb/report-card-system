import styled from 'styled-components';

const OuterBoletim = styled.div`
  margin-top: 64px;

  padding: 0 160px;
`;

const Title = styled.p`
  font: normal normal 600 24px/30px Lexend;
  color: #494d4b;
`;

export default function Boletim() {
  return (
    <OuterBoletim>
      <Title>Boletim escolar</Title>
    </OuterBoletim>
  );
}
