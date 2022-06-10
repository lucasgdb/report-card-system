import 'dayjs/locale/pt-br';

import { environment } from '@usefaz/relay';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { RelayEnvironmentProvider } from 'relay-hooks';
import { ThemeProvider } from 'styled-components';
import ptBRLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import dayjs from 'dayjs';

import GlobalStyle from './GlobalStyle';
import CustomSnackbarProvider from './components/CustomSnackbarProvider';

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
    mode: 'light',
    primary: {
      main: '#EE7844',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0020A2',
    },
  },

  bg: {
    main: '#fafafa',
    success: '#22E575',
    warning: '#f9c74f',
    dialogHeader: '#fafafa',
    dialogContent: '#fafafa',
    dialogActions: '#f5f5fb',
  },
  text: {
    main: '#808080',
    title: '#494d4b',
    dialogTitle: '#333',
    closeButton: '#333',
    dialogDescription: '#666',
  },
});

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <MUIThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBRLocale}>
            <CustomSnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <GlobalStyle />
              {children}
            </CustomSnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </MUIThemeProvider>
    </RelayEnvironmentProvider>
  );
}
