import styled from 'styled-components';

import Form from './Form';

const OuterRecoverPassword = styled.div`
  width: 100%;
  max-width: 358px;

  padding-bottom: 16px;

  @media (min-width: 1280px) {
    position: absolute;
    top: 203px;
    right: 256px;
  }
`;

const RecoverPasswordTextImage = styled.img`
  max-width: 100%;
`;

const RecoverPasswordText = styled.p`
  font: normal normal 400 16px/24px Lexend;
  color: #fafafa;

  margin: 8px 0 0;
`;

export default function RecoverPassword() {
  return (
    <OuterRecoverPassword>
      <RecoverPasswordTextImage src="/assets/images/forgot_password_text.svg" />

      <RecoverPasswordText>Digite sua nova senha abaixo para finalizar a recuperação de senha.</RecoverPasswordText>

      <Form />
    </OuterRecoverPassword>
  );
}
