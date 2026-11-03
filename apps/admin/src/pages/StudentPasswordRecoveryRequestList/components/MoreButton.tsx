import type { GridRenderCellParams } from '@usefaz/ui/components/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
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
import { BanIcon, EllipsisVerticalIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'react-relay';

import RefuseStudentPasswordRecoveryRequestMutation from '~/modules/admin/RefuseStudentPasswordRecoveryRequestMutation';
import type { RefuseStudentPasswordRecoveryRequestMutation as RefuseStudentPasswordRecoveryRequestMutationType } from '~/modules/admin/__generated__/RefuseStudentPasswordRecoveryRequestMutation.graphql';
import SendStudentPasswordResetLinkMutation from '~/modules/admin/SendStudentPasswordResetLinkMutation';
import type { SendStudentPasswordResetLinkMutation as SendStudentPasswordResetLinkMutationType } from '~/modules/admin/__generated__/SendStudentPasswordResetLinkMutation.graphql';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
};

export default function MoreButton({ params, disabled = false }: MoreButtonProps) {
  const [refuseStudentPasswordRecoveryRequest, loading] = useMutation<RefuseStudentPasswordRecoveryRequestMutationType>(
    RefuseStudentPasswordRecoveryRequestMutation
  );

  const [sendResetLink, sendingLink] = useMutation<SendStudentPasswordResetLinkMutationType>(
    SendStudentPasswordResetLinkMutation
  );

  const [isSendLinkDialogOpen, setIsSendLinkDialogOpen] = useState(false);
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);

  const studentPasswordRecoveryRequestId = params.row.id;
  const linkSent = params.row.status === 'LINK_SENT';

  const handleSendLink = () =>
    sendResetLink({
      variables: { input: { studentPasswordRecoveryRequestId } },
      onCompleted: ({ sendStudentPasswordResetLink }) => {
        if (handleMutationError(toastErrors, sendStudentPasswordResetLink?.error)) {
          return;
        }
        setIsSendLinkDialogOpen(false);
        toast.success(`Link enviado para ${params.row.email}.`);
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });

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

        <DropdownMenuContent align="end" className="min-w-52">
          <DropdownMenuItem disabled={params.row.status === 'REFUSED'} onClick={() => setIsSendLinkDialogOpen(true)}>
            <MailIcon />
            {linkSent ? 'Reenviar link de senha' : 'Enviar link de senha'}
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
            <AlertDialogMedia variant="destructive">
              <BanIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Recusar solicitação?</AlertDialogTitle>
            <AlertDialogDescription>
              A solicitação de <b className="font-medium text-foreground">{params.row.fullname}</b> (RM {params.row.RM})
              será marcada como recusada e a senha do aluno não será alterada.
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

      <AlertDialog open={isSendLinkDialogOpen} onOpenChange={setIsSendLinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <MailIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>{linkSent ? 'Reenviar link de senha?' : 'Enviar link de senha?'}</AlertDialogTitle>
            <AlertDialogDescription>
              <b className="font-medium text-foreground">{params.row.fullname}</b> vai receber em{' '}
              <b className="font-medium text-foreground">{params.row.email}</b> um link para criar uma nova senha. O
              link vale por 3 dias{linkSent ? ' e o anterior deixa de funcionar' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendLink} loading={sendingLink}>
              Enviar link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
