import {
  SimpleDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogActions,
  SimpleButton,
  Notification,
  CloseButton,
} from '@usefaz/components';
import styled from 'styled-components';
import { useMutation, useFragment, graphql } from 'relay-hooks';
import { ConnectionHandler } from 'relay-runtime';

import RemoveStudentMutation from '~/modules/admin/RemoveStudentMutation';
import { RemoveStudentMutation as RemoveStudentMutationType } from '~/modules/admin/__generated__/RemoveStudentMutation.graphql';
import { RemoveStudentDialog_admin$key } from './__generated__/RemoveStudentDialog_admin.graphql';

const OuterRemoveStudentDialog = styled(SimpleDialog)`
  & .MuiPaper-root {
    max-width: 600px;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  && {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #666;
  margin: 0;
`;

type RemoveStudentDialogProps = {
  open: boolean;
  studentId: string;
  onClose(): void;
  admin: RemoveStudentDialog_admin$key;
};

export default function RemoveStudentDialog({ open, studentId, onClose, admin }: RemoveStudentDialogProps) {
  const data = useFragment<RemoveStudentDialog_admin$key>(
    graphql`
      fragment RemoveStudentDialog_admin on Admin {
        id
      }
    `,
    admin
  );

  const { enqueueSnackbar } = Notification.useSnackbar();

  const [removeStudent, { loading }] = useMutation<RemoveStudentMutationType>(RemoveStudentMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    removeStudent({
      variables: { input: { studentId } },
      onCompleted() {
        onClose();
        enqueueSnackbar('Aluno removido com sucesso.', { variant: 'success' });
      },
      onError() {
        enqueueSnackbar('Falha ao remover aluno.', { variant: 'error' });
      },
      updater: (store) => {
        const admin = store.get(data.id);

        const students = ConnectionHandler.getConnection(admin, 'StudentList_students');

        ConnectionHandler.deleteNode(students, studentId);
      },
    });
  };

  return (
    <OuterRemoveStudentDialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Deseja remover o aluno?</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <StyledDialogContent>
          <Description>Clique em remover para remover o aluno do sistema.</Description>
        </StyledDialogContent>

        <DialogActions>
          <SimpleButton color="secondary" onClick={onClose}>
            Cancelar
          </SimpleButton>

          <SimpleButton color="error" variant="contained" type="submit" disabled={loading}>
            Remover
          </SimpleButton>
        </DialogActions>
      </form>
    </OuterRemoveStudentDialog>
  );
}
