import { errorConfig, getError, jwtToken, __DEV__ } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import styled from 'styled-components';

import Button from '@mui/material/Button';

import { useMutation } from 'relay-hooks';
import { Link } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import AdminLoginMutation from '~/modules/admin/AdminLoginMutation';
import { AdminLoginMutation as AdminLoginMutationType } from '~/modules/admin/__generated__/AdminLoginMutation.graphql';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import RememberMeCheckbox from './RememberMeCheckbox';

const OuterForm = styled.div`
  margin-top: 42px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionsWrapper = styled.div`
  padding: 24px 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Hyperlink = styled(Link)`
  && {
    color: #f7f5fa;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;
  }
`;

export default function Form() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { enqueueSnackbar } = Notification.useSnackbar();

  const [loginMutation, { loading }] = useMutation<AdminLoginMutationType>(AdminLoginMutation, {
    onError(errors) {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Administrador não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email').toString();
    if (!email) {
      enqueueSnackbar('E-mail obrigatório.', { variant: 'error' });
      return;
    }

    const password = formData.get('password').toString();
    if (!password) {
      enqueueSnackbar('Senha obrigatória.', { variant: 'error' });
      return;
    }

    const rememberMe = Boolean(formData.get('rememberMe')?.toString());

    const token = __DEV__ ? '' : await executeRecaptcha('login');

    loginMutation({
      variables: {
        input: { email, password, token },
      },
      onCompleted: ({ adminLogin }) => {
        if (adminLogin.jwtToken) {
          if (rememberMe) {
            localStorage.setItem('Usefaz-Email', email);
          } else {
            localStorage.removeItem('Usefaz-Email');
          }

          jwtToken.set(adminLogin.jwtToken);

          window.location.reload();
        }
      },
    });
  };

  return (
    <OuterForm>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <EmailInput />
          <PasswordInput />
        </InputWrapper>

        <OptionsWrapper>
          <RememberMeCheckbox />
          <Hyperlink to="/esqueci-minha-senha">Esqueci minha senha</Hyperlink>
        </OptionsWrapper>

        <LoginButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Entrar
        </LoginButton>
      </form>
    </OuterForm>
  );
}
