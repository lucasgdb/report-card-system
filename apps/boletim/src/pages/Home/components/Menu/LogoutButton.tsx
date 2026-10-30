import { handleMutationError } from '@usefaz/shared';
import { jwtToken } from '@usefaz/shared/browser';
import { Button } from '@usefaz/ui/components/ui/button';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { PowerIcon } from 'lucide-react';
import { useMutation } from 'react-relay';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import type { LogoutMutation as LogoutMutationType } from '~/modules/auth/__generated__/LogoutMutation.graphql';

export default function LogoutButton() {
  const [logoutMutation, loading] = useMutation<LogoutMutationType>(LogoutMutation);

  const handleLogout = () =>
    logoutMutation({
      variables: { input: {} },
      onCompleted: ({ logout }) => {
        if (handleMutationError(toastErrors, logout?.error)) {
          return;
        }
        jwtToken.destroy();
        window.location.reload();
      },
      onError: (error) => handleMutationError(toastErrors, error),
    });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-(--text-main)"
      onClick={handleLogout}
      loading={loading}
      aria-label="Sair"
    >
      <PowerIcon />
    </Button>
  );
}
