import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';

import RemoveAvatarButton from './RemoveAvatarButton';

const StyledDialog = styled(Dialog)`
  && {
    padding: 0 16px;
  }

  & .MuiDialog-paper {
    width: 100%;
    max-width: 320px;

    margin: 0;
    padding: 24px 32px;
    box-sizing: border-box;

    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const Title = styled.h1`
  font: normal normal normal 20px/24px Lexend;
  color: #333;
  margin: 0;
`;

const DialogContent = styled.div`
  margin-top: 32px;
`;

const Description = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #666;
  margin: 0;
`;

const DialogActions = styled.div`
  margin-top: 32px;

  display: flex;
  justify-content: center;
  gap: 16px;
`;

const CancelButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 16px 24px;

    font: normal normal normal 16px/16px Lexend;
  }
`;

type RemoveAvatarModalProps = {
  open: boolean;
  onClose(): void;
};

export default function RemoveAvatarModal({ open, onClose }: RemoveAvatarModalProps) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <Title>Remover avatar</Title>

      <DialogContent>
        <Description>Tem certeza que deseja remover seu avatar atual?</Description>
      </DialogContent>

      <DialogActions>
        <CancelButton variant="text" color="secondary" onClick={onClose}>
          Cancelar
        </CancelButton>

        <RemoveAvatarButton onClose={onClose} />
      </DialogActions>
    </StyledDialog>
  );
}
