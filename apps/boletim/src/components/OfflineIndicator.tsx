import { Notification } from '@usefaz/components';
import { useEffect } from 'react';

export default function OfflineIndicator() {
  const { enqueueSnackbar, closeSnackbar } = Notification.useSnackbar();

  useEffect(() => {
    const hideOfflineNotification = () => closeSnackbar();

    const showOfflineNotification = () => enqueueSnackbar('Sem conexão.', { variant: 'error' });

    window.addEventListener('online', hideOfflineNotification);
    window.addEventListener('offline', showOfflineNotification);

    return () => {
      window.removeEventListener('online', hideOfflineNotification);
      window.removeEventListener('offline', showOfflineNotification);
    };
  }, []);

  return null;
}
