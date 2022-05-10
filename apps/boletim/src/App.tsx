import { ErrorBoundary } from '@usefaz/components';
import CssBaseline from '@mui/material/CssBaseline';

import Providers from './Providers';
import AppRoutes from './routes';

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Providers>
        <CssBaseline />

        <ErrorBoundary onActionClick={() => window.location.reload()}>
          <AppRoutes />
        </ErrorBoundary>
      </Providers>
    </ThemeProvider>
  );
}
