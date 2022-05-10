import 'dayjs/locale/pt-br';

import { environment } from '@usefaz/relay';
import { ThemeProvider } from 'styled-components';
import MUIThemeProvider from '@mui/material/styles/ThemeProvider';
import { RelayEnvironmentProvider } from 'relay-hooks';
import ptBRLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs from 'dayjs';

import GlobalStyle from './GlobalStyle';
import CustomSnackbarProvider from './components/CustomSnackbarProvider';
import OfflineIndicator from './components/OfflineIndicator';
import { useThemeContext } from './contexts/ThemeContext';
import { darkTheme, lightTheme } from './utils/theme';

dayjs.locale('pt-br');

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const { theme } = useThemeContext();

  return (
    <RelayEnvironmentProvider environment={environment}>
      <MUIThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBRLocale}>
            <CustomSnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <GlobalStyle />
              <OfflineIndicator />
              {children}
            </CustomSnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </MUIThemeProvider>
    </RelayEnvironmentProvider>
  );
}
