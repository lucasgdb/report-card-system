import { SimpleDialog, DialogHeader, DialogTitle, CloseButton, DialogContent, DialogActions } from '@usefaz/components';
import Button from '@mui/material/Button';
import styled from 'styled-components';

import RemoveAvatarButton from './RemoveAvatarButton';

const StyledSimpleDialog = styled(SimpleDialog)`
  & .MuiDialog-paper {
    max-width: 320px;
  }
`;

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #666;
  margin: 0;
`;

const CancelButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type RemoveAvatarModalProps = {
  open: boolean;
  onClose(): void;
};

export default function RemoveAvatarModal({ open, onClose }: RemoveAvatarModalProps) {
  return (
    <StyledSimpleDialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Remover avatar</DialogTitle>
        <CloseButton onClose={onClose} />
      </DialogHeader>

      <DialogContent>
        <Description>Tem certeza que deseja remover seu avatar atual?</Description>
      </DialogContent>

      <DialogActions>
        <CancelButton variant="text" color="secondary" onClick={onClose}>
          Cancelar
        </CancelButton>

        <RemoveAvatarButton onClose={onClose} />
      </DialogActions>
    </StyledSimpleDialog>
  );
}
