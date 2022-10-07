import styled from 'styled-components';

import Form from './Form';

const OuterLogin = styled.div`
  width: 100%;
  max-width: 358px;

  padding-bottom: 16px;

  @media (min-width: 1280px) {
    position: absolute;
    top: 153px;
    right: 256px;
  }
`;

const ProfessorTextImage = styled.img`
  max-width: 100%;
`;

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

export default function Login() {
  return (
    <OuterLogin>
      <ProfessorTextImage src="/assets/images/professor_text.svg" />

      <ValueText>
        você é o piloto
        <br />
        deste foguete!
      </ValueText>

      <LoginText>
        Faça seu login para
        <br />
        acessar a plataforma.
      </LoginText>

      <Form />
    </OuterLogin>
  );
}
