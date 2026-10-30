import type { GridRenderCellParams } from '@usefaz/ui/components/data-table';
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
import { Button } from '@usefaz/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usefaz/ui/components/ui/dropdown-menu';
import { handleMutationError } from '@usefaz/shared';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { BanIcon, EllipsisVerticalIcon, KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'react-relay';

import RefuseStudentPasswordRecoveryRequestMutation from '~/modules/admin/RefuseStudentPasswordRecoveryRequestMutation';
import type { RefuseStudentPasswordRecoveryRequestMutation as RefuseStudentPasswordRecoveryRequestMutationType } from '~/modules/admin/__generated__/RefuseStudentPasswordRecoveryRequestMutation.graphql';
import EditPasswordDialog from './EditPasswordDialog';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
};

export default function MoreButton({ params, disabled = false }: MoreButtonProps) {
  const [refuseStudentPasswordRecoveryRequest, loading] = useMutation<RefuseStudentPasswordRecoveryRequestMutationType>(
    RefuseStudentPasswordRecoveryRequestMutation
  );

  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] = useState(false);
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);

  const studentPasswordRecoveryRequestId = params.row.id;

  const handleRefuse = () =>
    refuseStudentPasswordRecoveryRequest({
      variables: { input: { studentPasswordRecoveryRequestId } },
      onCompleted: ({ refuseStudentPasswordRecoveryRequest }) => {
        if (handleMutationError(toastErrors, refuseStudentPasswordRecoveryRequest?.error)) {
          return;
        }
        setIsRefuseDialogOpen(false);
        toast.success('Solicitação recusada.');
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button variant="ghost" size="icon" aria-label={`Mais ações para a solicitação de ${params.row.RM}`} />
          }
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => setIsEditPasswordDialogOpen(true)}>
            <KeyRoundIcon />
            Editar senha
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={loading || params.row.status === 'REFUSED'}
            onClick={() => setIsRefuseDialogOpen(true)}
          >
            <BanIcon />
            Recusar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isRefuseDialogOpen} onOpenChange={setIsRefuseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar solicitação?</AlertDialogTitle>
            <AlertDialogDescription>
              A solicitação do RM {params.row.RM} será marcada como recusada e a senha do aluno não será alterada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRefuse} loading={loading}>
              Recusar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditPasswordDialog
        open={isEditPasswordDialogOpen}
        onClose={() => setIsEditPasswordDialogOpen(false)}
        studentPasswordRecoveryRequestId={studentPasswordRecoveryRequestId}
      />
    </>
  );
}
