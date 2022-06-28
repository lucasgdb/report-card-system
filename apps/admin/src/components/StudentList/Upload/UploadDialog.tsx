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

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #333;
  margin-bottom: 0;
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

        const edges = response.data.students.edges.map(({ node: student }, index) => {
          const newLinkedRecord = students.getOrCreateLinkedRecord(`edges:${index}`, 'StudentEdge');
          newLinkedRecord.setValue(student.id, 'id');
          newLinkedRecord.setValue(student.RM, 'RM');
          newLinkedRecord.setValue(student.fullname, 'fullname');

          return newLinkedRecord;
        });

        students.setLinkedRecords(edges, 'edges');
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
    <OuterUploadDialog open={open} onClose={onClose} TransitionProps={{ onExit: () => setFilename('') }} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Upload de notas</DialogTitle>
          <CloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent>
          <Button variant="contained" component="label" htmlFor="csv">
            Selecionar arquivo
            <input type="file" id="csv" name="csv" accept=".csv" hidden onChange={handleInputChange} />
          </Button>

          {filename && <Description>{filename} selecionado.</Description>}
        </DialogContent>

        <DialogActions>
          <SimpleButton color="secondary" onClick={onClose}>
            Cancelar
          </SimpleButton>

          <SimpleButton color="secondary" variant="contained" type="submit" disabled={!filename || loading}>
            Upload
          </SimpleButton>
        </DialogActions>
      </form>
    </OuterUploadDialog>
  );
}
