import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#fafafa 0 0 no-repeat padding-box',
          overflowX: 'hidden',
          transition: '0.2s all',

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

export const darkTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#2e2e2e 0 0 no-repeat padding-box',
          overflowX: 'hidden',
          transition: '0.2s all',

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
    mode: 'dark',
    primary: {
      main: '#EE7844',
      contrastText: '#fff',
    },
    secondary: {
      main: '#244ef5',
    },
  },

  bg: {
    main: '#2e2e2e',
    success: '#1aac58',
    warning: '#e0b347',
    dialogHeader: '#2e2e2e',
    dialogContent: '#2e2e2e',
    dialogActions: '#2e2e2e',
  },
  text: {
    main: '#fafafa',
    title: '#fff',
    closeButton: '#fafafa',
    dialogTitle: '#fafafa',
    dialogDescription: '#afafaf',
  },
});
