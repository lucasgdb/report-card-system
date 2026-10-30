import { environment } from '@usefaz/relay';
import { Toaster } from '@usefaz/ui/components/ui/sonner';
import { TooltipProvider } from '@usefaz/ui/components/ui/tooltip';
import { RelayEnvironmentProvider } from 'react-relay';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </RelayEnvironmentProvider>
  );
}
