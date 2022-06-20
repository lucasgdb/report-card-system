import { ArrowPopper, ContextMenu, ContextMenuOption } from '@usefaz/components';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef, useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useMutation } from 'relay-hooks';

import EditPasswordDialog from './EditPasswordDialog';
import RefuseStudentPasswordRecoveryRequestMutation from '~/modules/admin/RefuseStudentPasswordRecoveryRequestMutation';
import { RefuseStudentPasswordRecoveryRequestMutation as RefuseStudentPasswordRecoveryRequestMutationType } from '~/modules/admin/__generated__/RefuseStudentPasswordRecoveryRequestMutation.graphql';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
};

export default function MoreButton({ params, disabled = false }: MoreButtonProps) {
  const [refuseStudentPasswordRecoveryRequest, { loading }] =
    useMutation<RefuseStudentPasswordRecoveryRequestMutationType>(RefuseStudentPasswordRecoveryRequestMutation);

  const buttonRef = useRef(null);

  const [isArrowPopperOpen, setIsArrowPopperOpen] = useState(false);
  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] = useState(false);

  const handleOpenArrowPopper = () => setIsArrowPopperOpen(true);
  const handleCloseArrowPopper = () => setIsArrowPopperOpen(false);

  const handleOpenPasswordDialog = () => setIsEditPasswordDialogOpen(true);
  const handleClosePasswordDialog = () => setIsEditPasswordDialogOpen(false);

  const studentPasswordRecoveryRequestId = params.row.id;

  const options: ContextMenuOption[] = [
    {
      id: 1,
      text: 'Editar senha',
      onClick() {
        handleCloseArrowPopper();
        handleOpenPasswordDialog();
      },
    },
    {
      id: 2,
      text: 'Recusar',
      disabled: loading || params.row.status === 'REFUSED',
      onClick() {
        refuseStudentPasswordRecoveryRequest({
          variables: { input: { studentPasswordRecoveryRequestId } },
          onCompleted() {
            handleCloseArrowPopper();
          },
        });
      },
    },
  ];

  return (
    <>
      <IconButton ref={buttonRef} onClick={handleOpenArrowPopper} disabled={disabled}>
        <MoreVertIcon />
      </IconButton>

      <ArrowPopper open={isArrowPopperOpen} onClose={handleCloseArrowPopper} anchorEl={buttonRef.current} timeout={0}>
        <div>
          <ContextMenu options={options} />
        </div>
      </ArrowPopper>

      <EditPasswordDialog
        open={isEditPasswordDialogOpen}
        onClose={handleClosePasswordDialog}
        studentPasswordRecoveryRequestId={studentPasswordRecoveryRequestId}
      />
    </>
  );
}
