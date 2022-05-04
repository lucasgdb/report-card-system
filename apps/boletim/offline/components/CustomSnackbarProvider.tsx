import { Notification } from '@usefaz/components';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createRef } from 'react';
import styled from 'styled-components';

const StyledCloseIcon = styled(CloseIcon)`
  && {
    color: #fff;
  }
`;

export default function CustomSnackbarProvider(props: Notification.SnackbarProviderProps) {
  const notistackRef = createRef<Notification.SnackbarProvider>();

  const onClickDismiss = (key: Notification.SnackbarKey) => () => notistackRef.current.closeSnackbar(key);

  return (
    <Notification.SnackbarProvider
      {...props}
      ref={notistackRef}
      action={(key) => (
        <IconButton onClick={onClickDismiss(key)}>
          <StyledCloseIcon />
        </IconButton>
      )}
    />
  );
}
