import { ArrowPopper, ContextMenu, ContextMenuOption } from '@usefaz/components';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef, useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { graphql, useFragment } from 'react-relay';

import EditStudentInformationDialog from './EditStudentInformationDialog';
import RemoveStudentDialog from './RemoveStudentDialog';
import { MoreButton_admin$key } from './__generated__/MoreButton_admin.graphql';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
  admin: MoreButton_admin$key;
};

export default function MoreButton({ params, disabled = false, admin }: MoreButtonProps) {
  const data = useFragment<MoreButton_admin$key>(
    graphql`
      fragment MoreButton_admin on Admin {
        ...RemoveStudentDialog_admin
      }
    `,
    admin
  );

  const buttonRef = useRef(null);

  const [isArrowPopperOpen, setIsArrowPopperOpen] = useState(false);
  const [isEditStudentInformationDialogOpen, setIsEditStudentInformationDialogOpen] = useState(false);
  const [isRemoveStudentDialogOpen, setIsRemoveStudentDialogOpen] = useState(false);

  const handleOpenArrowPopper = () => setIsArrowPopperOpen(true);
  const handleCloseArrowPopper = () => setIsArrowPopperOpen(false);

  const handleOpenEditStudentInformationDialog = () => setIsEditStudentInformationDialogOpen(true);
  const handleCloseEditStudentInformationDialog = () => setIsEditStudentInformationDialogOpen(false);

  const handleOpenRemoveStudentDialog = () => setIsRemoveStudentDialogOpen(true);
  const handleCloseRemoveStudentDialog = () => setIsRemoveStudentDialogOpen(false);

  const options: ContextMenuOption[] = [
    {
      id: 1,
      text: 'Editar Informações',
      onClick() {
        handleCloseArrowPopper();
        handleOpenEditStudentInformationDialog();
      },
    },
    {
      id: 2,
      text: 'Remover',
      onClick() {
        handleCloseArrowPopper();
        handleOpenRemoveStudentDialog();
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

      <RemoveStudentDialog
        open={isRemoveStudentDialogOpen}
        studentId={params.row.id}
        onClose={handleCloseRemoveStudentDialog}
        admin={data}
      />
    </>
  );
}
