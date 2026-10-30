import { toast } from '@usefaz/ui/components/ui/sonner';
import { useEffect } from 'react';

const TOAST_ID = 'connection-status';

type ConnectionStatusProps = {
  /** On the offline page, coming back online offers reloading to get the live report card. */
  offlinePage?: boolean;
};

/** Tells the student when the connection drops (it stays until it's back) and when it returns. */
export default function ConnectionStatus({ offlinePage = false }: ConnectionStatusProps) {
  useEffect(() => {
    const handleOffline = () =>
      toast.error('Sem conexão.', {
        id: TOAST_ID,
        description: 'Você está vendo a última versão salva do boletim.',
        duration: Number.POSITIVE_INFINITY,
      });

    const handleOnline = () =>
      offlinePage
        ? toast.success('Sua conexão voltou.', {
            id: TOAST_ID,
            description: 'Recarregue para ver a versão mais recente do boletim.',
            duration: Number.POSITIVE_INFINITY,
            action: { label: 'Recarregar', onClick: () => window.location.assign('/') },
          })
        : toast.success('Sua conexão voltou.', { id: TOAST_ID });

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [offlinePage]);

  return null;
}
