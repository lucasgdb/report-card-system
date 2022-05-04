import styled from 'styled-components';

const OuterProfileInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  @media (max-width: 863px) {
    padding: 0 24px;
    margin-top: 8px;
  }
`;

const RMText = styled.p`
  font: normal normal 700 24px/28px Lexend;
  color: #fafafa;

  margin: 0;

  @media (min-width: 864px) {
    font: normal normal 700 32px/40px Lexend;
  }
`;

const FullnameText = styled.p`
  font: normal normal 700 24px/28px Lexend;
  color: #fafafa;

  text-transform: uppercase;
  margin: 0;

  @media (min-width: 864px) {
    font: normal normal 700 32px/40px Lexend;
  }
`;

const Status = styled.div`
  padding: 11px 0;
  width: 250px;

  background-color: #22e675;
  border-radius: 4px;
`;

const StatusText = styled.p`
  font: normal normal 700 24px/30px Lexend;
  color: #fafafa;
  margin: 0;
  text-align: center;

  text-transform: uppercase;
`;

export default function Information() {
  return (
    <OuterProfileInformation>
      <RMText>RM: 12345</RMText>
      <FullnameText>NOME: Lucas Bittencourt</FullnameText>

      <Status>
        <StatusText>APROVADO</StatusText>
      </Status>
    </OuterProfileInformation>
  );
}
