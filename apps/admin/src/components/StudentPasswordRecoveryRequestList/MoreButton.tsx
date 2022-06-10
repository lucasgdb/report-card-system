import { ArrowPopper } from '@usefaz/components';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef, useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';

import Menu from './Menu';
import EditPasswordDialog from './EditPasswordDialog';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled: boolean;
};

export default function MoreButton({ params, disabled }: MoreButtonProps) {
  const buttonRef = useRef(null);

  const [isArrowPopperOpen, setIsArrowPopperOpen] = useState(false);
  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] = useState(false);

  const handleOpenArrowPopper = () => setIsArrowPopperOpen(true);
  const handleCloseArrowPopper = () => setIsArrowPopperOpen(false);

  const handleOpenPasswordDialog = () => setIsEditPasswordDialogOpen(true);
  const handleClosePasswordDialog = () => setIsEditPasswordDialogOpen(false);

  const studentPasswordRecoveryRequestId = params.id as string;

  return (
    <>
      <IconButton ref={buttonRef} onClick={handleOpenArrowPopper} disabled={disabled}>
        <MoreVertIcon />
      </IconButton>

      <ArrowPopper open={isArrowPopperOpen} onClose={handleCloseArrowPopper} anchorEl={buttonRef.current} timeout={0}>
        <div>
          <Menu
            onClose={handleCloseArrowPopper}
            onPasswordDialogOpen={handleOpenPasswordDialog}
            studentPasswordRecoveryRequestId={studentPasswordRecoveryRequestId}
          />
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
