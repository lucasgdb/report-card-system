import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import jwtToken from '~/utils/jwtToken';

export default function LogoutButton() {
  const [logoutMutation, { loading }] = useMutation(LogoutMutation, {
    onCompleted: () => {
      jwtToken.destroy();
      window.location.reload();
    },
    onError: () => {
      window.location.reload();
    },
  });

  const handleClick = () => logoutMutation({ variables: { input: {} } });

  return (
    <Button color="primary" variant="contained" onClick={handleClick} disabled={loading} style={{ color: '#fff' }}>
      Logout
    </Button>
  );
}
