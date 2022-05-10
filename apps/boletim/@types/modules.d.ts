import 'styled-components';
import { Theme } from '@mui/material/styles';

interface CustomTheme {
  bg: {
    main: string;
    success: string;
    warning: string;
    dialogHeader: string;
    dialogContent: string;
    dialogActions: string;
  };
  text: {
    main: string;
    title: string;
    closeButton: string;
    dialogTitle: string;
    dialogDescription: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
