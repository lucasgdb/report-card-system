import { ErrorBoundary } from '@usefaz/components';
import CssBaseline from '@mui/material/CssBaseline';

import Providers from './Providers';
import Routes from './routes';

export default function App() {
  return (
    <Providers>
      <CssBaseline />

      <ErrorBoundary onActionClick={() => window.location.reload()}>
        <Routes />
      </ErrorBoundary>
    </Providers>
  );
}
