import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@usefaz/ui/components/ui/alert-dialog';
import { handleMutationError } from '@usefaz/shared';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { graphql, useFragment, useMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

import RemoveStudentMutation from '~/modules/admin/RemoveStudentMutation';
import type { RemoveStudentMutation as RemoveStudentMutationType } from '~/modules/admin/__generated__/RemoveStudentMutation.graphql';
import type { RemoveStudentDialog_admin$key } from './__generated__/RemoveStudentDialog_admin.graphql';

type RemoveStudentDialogProps = {
  open: boolean;
  studentId: string;
  fullname: string;
  onClose(): void;
  admin: RemoveStudentDialog_admin$key;
};

export default function RemoveStudentDialog({ open, studentId, fullname, onClose, admin }: RemoveStudentDialogProps) {
  const data = useFragment<RemoveStudentDialog_admin$key>(
    graphql`
      fragment RemoveStudentDialog_admin on Admin {
        id
      }
    `,
    admin
  );

  const [removeStudent, loading] = useMutation<RemoveStudentMutationType>(RemoveStudentMutation);

  const handleRemove = () => {
    removeStudent({
      variables: {
        input: { studentId },
        connections: [ConnectionHandler.getConnectionID(data.id, 'StudentList_students')],
      },
      onCompleted: ({ removeStudent }) => {
        if (handleMutationError(toastErrors, removeStudent?.error)) {
          return;
        }
        onClose();
        toast.success('Aluno removido com sucesso.');
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover aluno?</AlertDialogTitle>
          <AlertDialogDescription>
            {fullname} será removido do sistema, junto com o boletim. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleRemove} loading={loading}>
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
