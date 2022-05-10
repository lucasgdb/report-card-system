import { jwtToken } from '@usefaz/shared';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useMutation } from 'relay-hooks';

import LogoutMutation from '~/modules/auth/LogoutMutation';

export default function LogoutButton() {
  const [logoutMutation, { loading }] = useMutation(LogoutMutation, {
    onCompleted() {
      jwtToken.destroy();
      window.location.reload();
    },
    onError() {
      window.location.reload();
    },
  });

  const handleLogout = () => logoutMutation({ variables: { input: {} } });

  return (
    <Tooltip title="Sair" arrow>
      <Button variant="contained" onClick={handleLogout} disabled={loading}>
        Sair
      </Button>
    </Tooltip>
  );
}
