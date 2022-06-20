import { useRef, useState } from 'react';
import styled from 'styled-components';
import { ArrowPopper, ContextMenu, ContextMenuOption } from '@usefaz/components';
import { graphql, useFragment, useMutation } from 'relay-hooks';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { AvatarMenu_admin$key } from './__generated__/AvatarMenu_admin.graphql';
import Avatar from './Avatar';
import LogoutMutation from '~/modules/auth/LogoutMutation';
import { jwtToken } from '@usefaz/shared';

const OuterAvatarMenu = styled.div`
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledArrowDownIcon = styled(ArrowDownIcon)`
  && {
    font-size: 19px;
    color: #fff;

    @media (min-width: 1200px) {
      color: #777;
    }
  }
`;

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

  const [logoutMutation, { loading }] = useMutation(LogoutMutation, {
    onCompleted() {
      jwtToken.destroy();
      window.location.reload();
    },
    onError() {
      window.location.reload();
    },
  });

  const avatarRef = useRef(null);

  const [isArrowPopperOpen, setIsArrowPopperOpen] = useState(false);

  const handleOpenArrowPopper = () => setIsArrowPopperOpen(true);
  const handleCloseArrowPopper = () => setIsArrowPopperOpen(false);

  const handleLogout = () => logoutMutation({ variables: { input: {} } });

  const options: ContextMenuOption[] = [
    {
      id: 1,
      text: 'Sair',
      disabled: loading,
      onClick() {
        handleLogout();
      },
    },
  ];

  return (
    <>
      <OuterAvatarMenu onClick={handleOpenArrowPopper}>
        <Avatar ref={avatarRef} admin={data} />
        <StyledArrowDownIcon />
      </OuterAvatarMenu>

      <ArrowPopper open={isArrowPopperOpen} onClose={handleCloseArrowPopper} anchorEl={avatarRef.current} disablePortal>
        <div>
          <ContextMenu options={options} />
        </div>
      </ArrowPopper>
    </>
  );
}
