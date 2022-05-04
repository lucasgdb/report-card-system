import styled from 'styled-components';

import Form from './Form';

const OuterForgotPassword = styled.div`
  width: 100%;
  max-width: 358px;

  padding-bottom: 16px;

  @media (min-width: 1280px) {
    position: absolute;
    top: 203px;
    right: 256px;
  }
`;

const ForgotPasswordTextImage = styled.img`
  max-width: 100%;
`;

const ForgotPasswordText = styled.p`
  font: normal normal 400 16px/24px Lexend;
  color: #fafafa;

  margin: 8px 0 0;
`;

export default function ForgotPassword() {
  return (
    <OuterForgotPassword>
      <ForgotPasswordTextImage src="/assets/images/forgot_password_text.svg" />

      <ForgotPasswordText>
        Digite seu e-mail abaixo para receber as instruções para redefinir sua senha.
      </ForgotPasswordText>

      <Form />
    </OuterForgotPassword>
  );
}
