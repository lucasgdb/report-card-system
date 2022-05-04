import { Notification } from '@usefaz/components';
import { useEffect } from 'react';

export default function OnlineIndicator() {
  const { enqueueSnackbar, closeSnackbar } = Notification.useSnackbar();

  useEffect(() => {
    const hideOnlineNotification = () => closeSnackbar();

    const showOnlineNotification = () => enqueueSnackbar('Sua conexão voltou.', { variant: 'success' });

    window.addEventListener('offline', hideOnlineNotification);
    window.addEventListener('online', showOnlineNotification);

    return () => {
      window.removeEventListener('offline', hideOnlineNotification);
      window.removeEventListener('online', showOnlineNotification);
    };
  }, []);

  return null;
}
