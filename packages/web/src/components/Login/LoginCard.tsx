import styled from 'styled-components';

import Form from './Form';

const OuterLoginCard = styled.div`
  width: 100%;
  max-width: 358px;
  z-index: 1;

  padding-bottom: 16px;

  @media (min-width: 1280px) {
    position: absolute;
    top: 153px;
    right: 256px;
  }
`;

const StudentTextImage = styled.img``;

const ValueText = styled.h1`
  font: normal normal 700 36px/54px Lexend;
  color: #fff;

  margin: 0;
`;

const LoginText = styled.p`
  font: normal normal 400 15px/25px Lexend;
  color: #fafafa;

  margin: 0;
`;

export default function LoginCard() {
  return (
    <OuterLoginCard>
      <StudentTextImage src="/assets/images/student.svg" />

      <ValueText>
        você é nosso
        <br />
        maior valor!
      </ValueText>

      <LoginText>
        Faça seu login para
        <br />
        acessar a plataforma.
      </LoginText>

      <Form />
    </OuterLoginCard>
  );
}
