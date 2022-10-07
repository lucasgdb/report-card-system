import {
  SimpleDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogActions,
  SimpleButton,
  PasswordInput,
  Notification,
  CloseButton,
} from '@usefaz/components';
import styled from 'styled-components';
import { useMutation } from 'relay-hooks';

import ChangeStudentPasswordMutation from '~/modules/admin/ChangeStudentPasswordMutation';
import { ChangeStudentPasswordMutation as ChangeStudentPasswordMutationType } from '~/modules/admin/__generated__/ChangeStudentPasswordMutation.graphql';

const OuterEditPasswordDialog = styled(SimpleDialog)`
  & .MuiPaper-root {
    max-width: 400px;
  }
`;

type EditPasswordDialogProps = {
  open: boolean;
  studentPasswordRecoveryRequestId: string;
  onClose(): void;
};

export default function EditPasswordDialog({
  open,
  studentPasswordRecoveryRequestId,
  onClose,
}: EditPasswordDialogProps) {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [changeStudentPassword, { loading }] =
    useMutation<ChangeStudentPasswordMutationType>(ChangeStudentPasswordMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const password = formData.get('password').toString();
    if (!password) {
      enqueueSnackbar('Digite a nova senha do aluno.', { variant: 'error' });
      return;
    }

    changeStudentPassword({
      variables: { input: { newPassword: password, studentPasswordRecoveryRequestId } },
      onCompleted() {
        onClose();
        enqueueSnackbar('Senha alterada com sucesso.', { variant: 'success' });
      },
      onError() {
        enqueueSnackbar('Falha ao alterar senha.', { variant: 'error' });
      },
    });
  };

  return (
    <OuterEditPasswordDialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent>
          <PasswordInput placeholder="Nova senha" />
        </DialogContent>

        <DialogActions>
          <SimpleButton color="error" onClick={onClose}>
            Cancelar
          </SimpleButton>

          <SimpleButton color="secondary" variant="contained" type="submit" disabled={loading}>
            Salvar
          </SimpleButton>
        </DialogActions>
      </form>
    </OuterEditPasswordDialog>
  );
}
