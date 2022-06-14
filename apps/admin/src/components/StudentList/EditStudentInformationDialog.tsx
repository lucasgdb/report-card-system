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
  RMInput,
} from '@usefaz/components';
import styled from 'styled-components';
import { useMutation } from 'relay-hooks';

import ChangeStudentInformationMutation from '~/modules/admin/ChangeStudentInformationMutation';
import { ChangeStudentInformationMutation as ChangeStudentInformationMutationType } from '~/modules/admin/__generated__/ChangeStudentInformationMutation.graphql';
import NameInput from './NameInput';

const OuterEditStudentInformationDialog = styled(SimpleDialog)`
  & .MuiPaper-root {
    max-width: 400px;
  }
`;

type EditStudentInformationDialogProps = {
  open: boolean;
  studentId: string;
  RM: string;
  fullname: string;
  onClose(): void;
};

export default function EditStudentInformationDialog({
  open,
  studentId,
  RM,
  fullname,
  onClose,
}: EditStudentInformationDialogProps) {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [changeStudentInformation, { loading }] = useMutation<ChangeStudentInformationMutationType>(
    ChangeStudentInformationMutation
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newRM = formData.get('RM').toString();
    const newFullname = formData.get('fullname').toString();
    const newPassword = formData.get('password').toString();

    changeStudentInformation({
      variables: { input: { studentId, RM: newRM, fullname: newFullname, password: newPassword } },
      onCompleted() {
        onClose();
        enqueueSnackbar('Dados alterados com sucesso.', { variant: 'success' });
      },
      onError() {
        enqueueSnackbar('Falha ao alterar dados.', { variant: 'error' });
      },
    });
  };

  return (
    <OuterEditStudentInformationDialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Alterar informações</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent>
          <RMInput defaultValue={RM} />
          <NameInput defaultValue={fullname} />
          <PasswordInput />
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
    </OuterEditStudentInformationDialog>
  );
}
