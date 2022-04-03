import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';

import CreateUserMutation from '~/modules/auth/CreateUserMutation';
import { CreateUserMutation as CreateUserMutationType } from '~/modules/auth/__generated__/CreateUserMutation.graphql';
import jwtToken from '~/utils/jwtToken';

export default function RegisterButton() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [createUserMutation, { loading }] = useMutation<CreateUserMutationType>(CreateUserMutation, {
    onCompleted: ({ createUser }) => {
      if (createUser?.jwtToken) {
        jwtToken.set(createUser.jwtToken);
        window.location.reload();
      }
    },
    onError: (errors) => {
      const { duplicatedEmail } = errorConfig.user;

      const userAlreadyExistsError = getError(errors, duplicatedEmail.code);
      if (userAlreadyExistsError) {
        enqueueSnackbar('This user already exists.', { variant: 'error' });
      }
    },
  });

  const handleClick = () =>
    createUserMutation({
      variables: {
        input: {
          name: 'Lucas',
          lastname: 'Bittencourt',
          email: 'lucasgdbittencourt@gmail.com',
          password: '123',
        },
      },
    });

  return (
    <Button color="primary" onClick={handleClick} disabled={loading}>
      Register
    </Button>
  );
}
