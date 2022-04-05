import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import { useMutation } from 'relay-hooks';
import Button from '@mui/material/Button';

import jwtToken from '../utils/jwtToken';
import StudentLoginMutation from '~/modules/student/StudentLoginMutation';
import { StudentLoginMutation as StudentLoginMutationType } from '~/modules/student/__generated__/StudentLoginMutation.graphql';

export default function LoginButton() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onCompleted: ({ studentLogin }) => {
      if (studentLogin?.jwtToken) {
        jwtToken.set(studentLogin.jwtToken);
        window.location.reload();
      }
    },
    onError: (errors) => {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Student not found.', { variant: 'error' });
      }
    },
  });

  const handleClick = () => {
    loginMutation({
      variables: {
        input: { RM: '12345', password: '123' },
      },
    });
  };

  return (
    <Button color="secondary" onClick={handleClick} disabled={loading}>
      Login
    </Button>
  );
}
