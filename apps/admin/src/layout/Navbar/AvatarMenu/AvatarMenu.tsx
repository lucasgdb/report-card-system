import { handleMutationError } from '@usefaz/shared';
import { jwtToken } from '@usefaz/shared/browser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usefaz/ui/components/ui/dropdown-menu';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { toastErrors } from '@usefaz/ui/lib/toast-errors';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { graphql, useFragment, useMutation } from 'react-relay';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import type { LogoutMutation as LogoutMutationType } from '~/modules/auth/__generated__/LogoutMutation.graphql';
import type { AvatarMenu_admin$key } from './__generated__/AvatarMenu_admin.graphql';
import Avatar from './Avatar';

type AvatarMenuProps = {
  admin: AvatarMenu_admin$key;
};

export default function AvatarMenu({ admin }: AvatarMenuProps) {
  const data = useFragment<AvatarMenu_admin$key>(
    graphql`
      fragment AvatarMenu_admin on Admin {
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
        jwtToken.destroy();
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
        aria-label="Menu da conta"
        className="flex cursor-pointer items-center gap-1 rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar admin={data} />
        <ChevronDownIcon className="size-5 text-white min-[1200px]:text-[#777]" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem variant="destructive" disabled={loading} onClick={handleLogout}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
