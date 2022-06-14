import { ArrowPopper, ContextMenu, ContextMenuOption } from '@usefaz/components';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef, useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';

import EditStudentInformationDialog from './EditStudentInformationDialog';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
};

export default function MoreButton({ params, disabled = false }: MoreButtonProps) {
  const buttonRef = useRef(null);

  const [isArrowPopperOpen, setIsArrowPopperOpen] = useState(false);
  const [isEditStudentInformationDialogOpen, setIsEditStudentInformationDialogOpen] = useState(false);

  const handleOpenArrowPopper = () => setIsArrowPopperOpen(true);
  const handleCloseArrowPopper = () => setIsArrowPopperOpen(false);

  const handleOpenEditStudentInformationDialog = () => setIsEditStudentInformationDialogOpen(true);
  const handleCloseEditStudentInformationDialog = () => setIsEditStudentInformationDialogOpen(false);

  const options: ContextMenuOption[] = [
    {
      id: 1,
      text: 'Editar Informações',
      onClick() {
        handleCloseArrowPopper();
        handleOpenEditStudentInformationDialog();
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

      <EditStudentInformationDialog
        open={isEditStudentInformationDialogOpen}
        studentId={params.row.id}
        RM={params.row.RM}
        fullname={params.row.fullname}
        onClose={handleCloseEditStudentInformationDialog}
      />
    </>
  );
}
