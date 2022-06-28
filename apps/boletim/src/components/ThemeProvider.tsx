import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import MUIThemeProvider from '@mui/material/styles/ThemeProvider';

import { useThemeContext } from '~/contexts/ThemeContext';
import { darkTheme, lightTheme } from '~/utils/theme';

type ThemeProviderProps = {
  children: React.ReactChild;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeContext();

  return (
    <MUIThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <StyledThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</StyledThemeProvider>
    </MUIThemeProvider>
  );
}
