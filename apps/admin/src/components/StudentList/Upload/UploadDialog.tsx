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
import { useMutation } from 'relay-hooks';

import ChangeStudentPasswordMutation from '~/modules/admin/ChangeStudentPasswordMutation';
import { ChangeStudentPasswordMutation as ChangeStudentPasswordMutationType } from '~/modules/admin/__generated__/ChangeStudentPasswordMutation.graphql';

const OuterUploadDialog = styled(SimpleDialog)`
  & .MuiPaper-root {
    max-width: 400px;
  }
`;

type UploadDialogProps = {
  open: boolean;
  onClose(): void;
};

export default function UploadDialog({ open, onClose }: UploadDialogProps) {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [changeStudentPassword, { loading }] =
    useMutation<ChangeStudentPasswordMutationType>(ChangeStudentPasswordMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
  };

  return (
    <OuterUploadDialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Upload de notas</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent></DialogContent>

        <DialogActions>
          <SimpleButton color="error" onClick={onClose}>
            Cancelar
          </SimpleButton>

          <SimpleButton color="secondary" variant="contained" type="submit" disabled={loading}>
            Upload
          </SimpleButton>
        </DialogActions>
      </form>
    </OuterUploadDialog>
  );
}
