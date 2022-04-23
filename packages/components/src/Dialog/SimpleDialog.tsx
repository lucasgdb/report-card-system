import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';

export const SimpleDialog = styled(Dialog)`
  && {
    padding: 0 16px;
  }

  & .MuiDialog-paper {
    width: 100%;
    max-width: 600px;
    margin: 0;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

export const DialogHeader = styled.div`
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DialogTitle = styled.span`
  font: normal normal normal 24px/28px Lexend;
  color: #333;
`;

export const DialogContent = styled.div`
  padding: 24px 32px;

  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const DialogActions = styled.div`
  background-color: #f5f5fb;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
