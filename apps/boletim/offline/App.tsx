import { ErrorBoundary } from '@usefaz/ui/components/error-boundary';

import Providers from './Providers';
import AppRoutes from './routes';

export default function App() {
  return (
    <Providers>
      <ErrorBoundary onActionClick={() => window.location.reload()}>
        <AppRoutes />
      </ErrorBoundary>
    </Providers>
  );
}
