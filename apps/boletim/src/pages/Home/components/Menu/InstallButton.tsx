import styled from 'styled-components';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import { useEffect } from 'react';

declare global {
  interface Window {
    deferredPrompt: Event;
    installButtonShouldBeHidden: true | undefined;
    addInstallButtonEventListener(): void;
    showInstallButton(): void;
  }
}

const MobileInstallButton = styled(IconButton)`
  && {
    display: none;

    width: 24px;
    height: 24px;
    padding: 0;
  }
`;

const DesktopInstallButton = styled(Button)`
  && {
    display: none;

    border-radius: 8px;
    padding: 2px 10px;
  }
`;

export default function InstallButton() {
  const isMobile = useMediaQuery('(max-width: 499px)');

  useEffect(() => {
    if (window.deferredPrompt && !window.installButtonShouldBeHidden) {
      window.addInstallButtonEventListener();
      window.showInstallButton();
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <MobileInstallButton color="primary" id="install-button">
        <InstallMobileIcon color="secondary" />
      </MobileInstallButton>
    );
  }

  return (
    <DesktopInstallButton color="primary" variant="contained" id="install-button">
      Instalar
    </DesktopInstallButton>
  );
}
