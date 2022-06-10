import { errorConfig, getError, jwtToken, __DEV__ } from '@usefaz/shared';
import { Notification, PasswordInput } from '@usefaz/components';
import styled from 'styled-components';

import Button from '@mui/material/Button';

import { useMutation } from 'relay-hooks';
import { Link } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import StudentLoginMutation from '~/modules/student/StudentLoginMutation';
import { StudentLoginMutation as StudentLoginMutationType } from '~/modules/student/__generated__/StudentLoginMutation.graphql';
import RMInput from './RMInput';
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

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onError(errors) {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Aluno não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const RM = formData.get('RM').toString();
    if (!RM) {
      enqueueSnackbar('RM obrigatório.', { variant: 'error' });
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
        input: { RM, password, token },
      },
      onCompleted: ({ studentLogin }) => {
        if (studentLogin.jwtToken) {
          if (rememberMe) {
            localStorage.setItem('Usefaz-RM', RM);
          } else {
            localStorage.removeItem('Usefaz-RM');
          }

          jwtToken.set(studentLogin.jwtToken);

          window.location.reload();
        }
      },
    });
  };

  return (
    <OuterForm>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <RMInput />
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
