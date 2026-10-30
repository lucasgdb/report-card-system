import { SeasonDecorations } from '@usefaz/ui/components/seasonal/season-decorations';
import { SeasonProvider } from '@usefaz/ui/components/seasonal/season-provider';
import { environment } from '@usefaz/relay';
import { Toaster } from '@usefaz/ui/components/ui/sonner';
import { RelayEnvironmentProvider } from 'react-relay';

import ConnectionStatus from './components/ConnectionStatus';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <SeasonProvider>
        <Toaster />
        <ConnectionStatus />
        {children}
        <SeasonDecorations />
      </SeasonProvider>
    </RelayEnvironmentProvider>
  );
}
