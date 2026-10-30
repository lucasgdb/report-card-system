import { SeasonDecorations } from '@usefaz/ui/components/seasonal/season-decorations';
import { SeasonProvider } from '@usefaz/ui/components/seasonal/season-provider';
import { Toaster } from '@usefaz/ui/components/ui/sonner';

import ConnectionStatus from '~/components/ConnectionStatus';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SeasonProvider>
      <Toaster />
      <ConnectionStatus offlinePage />
      {children}
      <SeasonDecorations />
    </SeasonProvider>
  );
}
