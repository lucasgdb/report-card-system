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
import { environment } from '@usefaz/relay';
import { commitLocalUpdate, graphql, useFragment } from 'react-relay';
import { fetchWithRetries } from '@usefaz/shared';
import Button from '@mui/material/Button';
import { ConnectionHandler } from 'relay-runtime';

import { UploadDialog_admin$key } from './__generated__/UploadDialog_admin.graphql';
import { useState } from 'react';

const OuterUploadDialog = styled(SimpleDialog)`
  & .MuiPaper-root {
    max-width: 400px;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  && {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #666;
  margin: 0;
`;

type UploadDialogProps = {
  open: boolean;
  onClose(): void;
  admin: UploadDialog_admin$key;
};

export default function UploadDialog({ open, onClose, admin }: UploadDialogProps) {
  const data = useFragment<UploadDialog_admin$key>(
    graphql`
      fragment UploadDialog_admin on Admin {
        id
      }
    `,
    admin
  );

  const { enqueueSnackbar } = Notification.useSnackbar();

  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);

      const response = await fetchWithRetries({
        method: 'POST',
        url: `${process.env.SERVER_BASE_URL}/admin/student/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      commitLocalUpdate(environment, (store) => {
        const admin = store.get(data.id);

        const students = ConnectionHandler.getConnection(admin, 'StudentList_students');

        for (const { node: student } of response.data.students.edges) {
          const linkedRecord = store.get(student.id);
          if (!linkedRecord) {
            const newLinkedRecord = store.create(student.id, 'Student');
            newLinkedRecord.setValue(student.id, 'id');
            newLinkedRecord.setValue(student.RM, 'RM');
            newLinkedRecord.setValue(student.fullname, 'fullname');
            const newEdge = ConnectionHandler.createEdge(store, students, newLinkedRecord, 'StudentEdge');

            ConnectionHandler.insertEdgeAfter(students, newEdge);
          }
        }
      });

      enqueueSnackbar('Upload feito com sucesso.', { variant: 'success' });
      onClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Erro ao fazer upload de notas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files.item(0);
    if (newFile) {
      setFilename(newFile.name);
    }
  };

  return (
    <OuterUploadDialog open={open} onClose={onClose} TransitionProps={{ onExited: () => setFilename('') }} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Carregar notas</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <StyledDialogContent>
          <Description>Clique abaixo para selecionar o arquivo contendo as notas.</Description>

          <Button variant="contained" component="label" htmlFor="csv">
            Selecionar arquivo
            <input type="file" id="csv" name="csv" accept=".csv" hidden onChange={handleInputChange} />
          </Button>

          {filename && (
            <Description>
              <b>{filename}</b> selecionado.
            </Description>
          )}
        </StyledDialogContent>

        <DialogActions>
          <SimpleButton color="secondary" onClick={onClose}>
            Cancelar
          </SimpleButton>

          <SimpleButton color="secondary" variant="contained" type="submit" disabled={!filename || loading}>
            Enviar
          </SimpleButton>
        </DialogActions>
      </form>
    </OuterUploadDialog>
  );
}
