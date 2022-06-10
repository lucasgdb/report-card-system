import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';

export const SimpleDialog = styled(Dialog)`
  & .MuiDialog-paper {
    margin: 0;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

export const DialogHeader = styled.div`
  background-color: ${(props) => props.theme.bg.dialogHeader};
  padding: 24px 32px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DialogTitle = styled.span`
  font: normal normal normal 24px/28px Lexend;
  color: ${(props) => props.theme.text.dialogTitle};
`;

export const DialogContent = styled.div`
  background-color: ${(props) => props.theme.bg.dialogContent};
  padding: 24px 32px;

  display: flex;
  gap: 16px;
`;

export const DialogActions = styled.div`
  background-color: ${(props) => props.theme.bg.dialogActions};
  padding: 24px 32px;

  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
