import 'dayjs/locale/pt-br';

import { Notification } from '@usefaz/components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RelayEnvironmentProvider } from 'relay-hooks';
import ptBRLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs from 'dayjs';

import { environment } from './utils/relay';

dayjs.locale('pt-br');

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#f5f5fb 0 0 no-repeat padding-box',
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

  palette: {
    primary: {
      main: '#200741',
    },
    secondary: {
      main: '#fe2a59',
    },
  },
});

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    // @ts-expect-error expected types are differently here but still works
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBRLocale}>
          <Notification.SnackbarProvider maxSnack={10} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            {children}
          </Notification.SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
}
