import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';

import jwtToken from '../utils/jwtToken';
import AdminLoginMutation from '~/modules/admin/AdminLoginMutation';
import { AdminLoginMutation as AdminLoginMutationType } from '~/modules/admin/__generated__/AdminLoginMutation.graphql';

export default function AdminLoginButton() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [loginMutation, { loading }] = useMutation<AdminLoginMutationType>(AdminLoginMutation, {
    onCompleted: ({ adminLogin }) => {
      if (adminLogin?.jwtToken) {
        jwtToken.set(adminLogin.jwtToken);
        window.location.reload();
      }
    },
    onError: (errors) => {
      const { notFound } = errorConfig.admin;

      const adminNotFoundError = getError(errors, notFound.code);
      if (adminNotFoundError) {
        enqueueSnackbar('Admin not found.', { variant: 'error' });
      }
    },
  });

  const handleClick = () => {
    loginMutation({
      variables: {
        input: { email: 'lucasgdbittencourt@gmail.com', password: '123' },
      },
    });
  };

  return (
    <Button color="secondary" onClick={handleClick} disabled={loading}>
      Admin Login
    </Button>
  );
}
