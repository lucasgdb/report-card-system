import 'dayjs/locale/pt-br';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RelayEnvironmentProvider } from 'relay-hooks';
import ptBRLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs from 'dayjs';

import { environment } from './utils/relay';
import GlobalStyle from './GlobalStyle';
import CustomSnackbarProvider from './components/CustomSnackbarProvider';
import OfflineIndicator from './components/OfflineIndicator';

dayjs.locale('pt-br');

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#fafafa 0 0 no-repeat padding-box',
          overflowX: 'hidden',

          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundColor: '#6b6b6b',
            minHeight: '24px',
            border: '3px solid #e8e6f2',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9d9d9d',
          },
          '&::-webkit-scrollbar-corner': {
            backgroundColor: '#e8e6f2',
          },
          '&::-webkit-scrollbar': {
            backgroundColor: '#e8e6f2',
          },
        },
      },
    },
  },

  typography: {
    fontFamily: 'Lexend',
  },

  palette: {
    primary: {
      main: '#EE7844',
    },
    secondary: {
      main: '#0020A2',
    },
  },
});

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBRLocale}>
          <CustomSnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <GlobalStyle />
            <OfflineIndicator />
            {children}
          </CustomSnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
}