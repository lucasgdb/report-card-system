import { handleMutationError } from '@usefaz/shared';
import { session } from '@usefaz/shared/browser';
import { SidebarAccountButton } from '@usefaz/ui/components/app-shell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usefaz/ui/components/ui/dropdown-menu';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { LogOutIcon } from 'lucide-react';
import { graphql, useFragment, useMutation } from 'react-relay';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import type { LogoutMutation as LogoutMutationType } from '~/modules/auth/__generated__/LogoutMutation.graphql';
import Avatar from './Avatar';
import type { AccountMenu_admin$key } from './__generated__/AccountMenu_admin.graphql';

type AccountMenuProps = {
  admin: AccountMenu_admin$key;
};

/** The signed-in admin at the bottom of the sidebar, with the sign-out action. */
export default function AccountMenu({ admin }: AccountMenuProps) {
  const data = useFragment<AccountMenu_admin$key>(
    graphql`
      fragment AccountMenu_admin on Admin {
        fullname
        email
        ...Avatar_admin
      }
    `,
    admin
  );

  const [logoutMutation, loading] = useMutation<LogoutMutationType>(LogoutMutation);

  const handleLogout = () => {
    const toastId = toast.loading('Saindo…');

    logoutMutation({
      variables: { input: {} },
      onCompleted: ({ logout }) => {
        if (handleMutationError(toastErrors, logout?.error)) {
          toast.dismiss(toastId);
          return;
        }
        session.clear();
        window.location.reload();
      },
      onError: (error) => {
        toast.dismiss(toastId);
        handleMutationError(toastErrors, error);
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarAccountButton
            aria-label={`Conta de ${data.fullname}`}
            avatar={<Avatar admin={data} />}
            name={data.fullname}
            detail={data.email}
          />
        }
      />
      <DropdownMenuContent side="top" align="start" className="w-(--anchor-width) min-w-56">
        <DropdownMenuItem variant="destructive" disabled={loading} onClick={handleLogout}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
