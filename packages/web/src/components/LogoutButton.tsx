import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import jwtToken from '~/utils/jwtToken';

export default function LogoutButton() {
  const navigate = useNavigate();

  const [logoutMutation, { loading }] = useMutation(LogoutMutation, {
    onCompleted: () => {
      jwtToken.destroy();
      navigate('/');
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
