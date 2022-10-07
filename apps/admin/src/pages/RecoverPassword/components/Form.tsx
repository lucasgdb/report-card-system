import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router';
import { useMutation } from 'relay-hooks';

import RecoverAdminPasswordMutation from '~/modules/admin/RecoverAdminPasswordMutation';
import { RecoverAdminPasswordMutation as RecoverAdminPasswordMutationType } from '~/modules/admin/__generated__/RecoverAdminPasswordMutation.graphql';
import PasswordInput from './PasswordInput';

const OuterForm = styled.div`
  margin-top: 24px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoginButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;

    margin-top: 24px;
  }
`;

export default function Form() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const navigate = useNavigate();
  const { requestId, token } = useParams<{ requestId: string; token: string }>();

  const [recoverPasswordMutation, { loading }] = useMutation<RecoverAdminPasswordMutationType>(
    RecoverAdminPasswordMutation,
    {
      onError(errors) {
        const { notFound } = errorConfig.student;

        const studentNotFoundError = getError(errors, notFound.code);
        if (studentNotFoundError) {
          enqueueSnackbar('Aluno não encontrado. Por favor, tente novamente.', { variant: 'error' });
        }
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const password = formData.get('password').toString();
    if (!password) {
      enqueueSnackbar('Senha obrigatória.', { variant: 'error' });
      return;
    }

    const passwordConfirmation = formData.get('passwordConfirmation').toString();
    if (!passwordConfirmation) {
      enqueueSnackbar('Senha obrigatória.', { variant: 'error' });
      return;
    }

    if (password !== passwordConfirmation) {
      enqueueSnackbar('Senha de confirmação deve ser igual a senha.', { variant: 'error' });
      return;
    }

    recoverPasswordMutation({
      variables: {
        input: {
          adminPasswordRecoveryRequestId: requestId,
          passwordRecoveryToken: token,
          password,
          passwordConfirmation,
        },
      },
      onCompleted() {
        navigate('/solicitacao-finalizada');
      },
      onError() {
        enqueueSnackbar('Falha ao enviar a solicitação de recuperação de senha.', { variant: 'error' });
      },
    });
  };

  return (
    <OuterForm>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <PasswordInput placeholder="Digite sua nova senha" name="password" />
          <PasswordInput placeholder="Repita a nova senha" name="passwordConfirmation" />
        </InputWrapper>

        <LoginButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Redefinir
        </LoginButton>
      </form>
    </OuterForm>
  );
}
