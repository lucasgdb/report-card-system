import { toast } from '@usefaz/ui/components/ui/sonner';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@usefaz/ui/components/ui/dialog';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { FileSpreadsheetIcon } from 'lucide-react';
import { environment } from '@usefaz/relay';
import { commitLocalUpdate, graphql, useFragment } from 'react-relay';
import { authorizedFetch } from '@usefaz/shared/browser';
import { ConnectionHandler } from 'relay-runtime';

import type { UploadDialog_admin$key } from './__generated__/UploadDialog_admin.graphql';
import { useRef, useState } from 'react';

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

  const inputRef = useRef<HTMLInputElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const [filename, setFilename] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!filename) {
      setFileError('Selecione o arquivo .csv com as notas.');
      selectButtonRef.current?.focus();
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      setLoading(true);

      const response = await authorizedFetch(`${process.env.SERVER_BASE_URL}/admin/student/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploaded = await response.json();

      commitLocalUpdate(environment, (store) => {
        const admin = store.get(data.id);

        const students = ConnectionHandler.getConnection(admin, 'StudentList_students');

        for (const { node: student } of uploaded.students.edges) {
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

      toast.success('Notas carregadas com sucesso.');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar as notas. Confira se o arquivo .csv segue o modelo e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files.item(0);
    if (newFile) {
      setFilename(newFile.name);
      setFileError('');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          setFilename('');
          setFileError('');
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Carregar notas</DialogTitle>
            <DialogDescription>Selecione o arquivo .csv com as notas dos alunos.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-start gap-3">
            <input ref={inputRef} type="file" id="csv" name="csv" accept=".csv" hidden onChange={handleInputChange} />
            <Button
              ref={selectButtonRef}
              variant="outline"
              onClick={() => inputRef.current?.click()}
              aria-invalid={fileError ? true : undefined}
              aria-describedby={fileError ? 'csv-error' : undefined}
            >
              <FileSpreadsheetIcon />
              Selecionar arquivo
            </Button>

            <p className="max-w-full min-w-0 text-sm break-all text-muted-foreground" aria-live="polite">
              {filename ? (
                <>
                  <b className="font-medium text-foreground">{filename}</b> selecionado.
                </>
              ) : (
                'Nenhum arquivo selecionado.'
              )}
            </p>
            <FieldError id="csv-error">{fileError}</FieldError>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" loading={loading}>
              Carregar notas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
