import { Notification } from '@usefaz/components';
import styled from 'styled-components';
import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';

import RemoveAvatarMutation from '~/modules/student/RemoveAvatarMutation';
import { RemoveAvatarMutation as RemoveAvatarMutationType } from '~/modules/student/__generated__/RemoveAvatarMutation.graphql';
import { forwardRef } from 'react';

const OuterRemoveAvatarButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 16px 24px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type RemoveAvatarButtonProps = {
  onClose(): void;
};

const RemoveAvatarButton = forwardRef<HTMLButtonElement, RemoveAvatarButtonProps>(({ onClose }, ref) => {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [loginMutation, { loading }] = useMutation<RemoveAvatarMutationType>(RemoveAvatarMutation, {
    onCompleted() {
      enqueueSnackbar('Avatar removido com sucesso.', { variant: 'success' });
      onClose();
    },
    onError() {
      enqueueSnackbar('Não foi possível remover seu avatar.', { variant: 'error' });
    },
  });

  const handleRemoveAvatar = () => loginMutation({ variables: { input: {} } });

  return (
    <OuterRemoveAvatarButton
      onClick={handleRemoveAvatar}
      disabled={loading}
      color="error"
      variant="contained"
      ref={ref}
    >
      Remover
    </OuterRemoveAvatarButton>
  );
});

export default RemoveAvatarButton;
