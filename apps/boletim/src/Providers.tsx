import 'dayjs/locale/pt-br';

import { environment } from '@usefaz/relay';
import { RelayEnvironmentProvider } from 'relay-hooks';
import ptBRLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import GlobalStyle from './GlobalStyle';
import CustomSnackbarProvider from './components/CustomSnackbarProvider';
import OfflineIndicator from './components/OfflineIndicator';
import ThemeProvider from './components/ThemeProvider';
import { ThemeProvider as ThemeProviderContext } from './contexts/ThemeContext';

dayjs.locale('pt-br');

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProviderContext>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBRLocale}>
            <CustomSnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <GlobalStyle />
              <OfflineIndicator />
              {children}
            </CustomSnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ThemeProviderContext>
    </RelayEnvironmentProvider>
  );
}
