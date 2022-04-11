import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useMutation } from 'relay-hooks';

import LogoutMutation from '~/modules/auth/LogoutMutation';
import jwtToken from '~/utils/jwtToken';

const StyledIconButton = styled(IconButton)`
  && {
    padding: 0;
  }
`;

const StyledPowerSettingsNewIcon = styled(PowerSettingsNewIcon)`
  && {
    color: #808080;
  }
`;

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

  const handleLogout = () => logoutMutation({ variables: { input: {} } });

  return (
    <Tooltip title="Sair" arrow>
      <StyledIconButton onClick={handleLogout} disabled={loading}>
        <StyledPowerSettingsNewIcon />
      </StyledIconButton>
    </Tooltip>
  );
}
