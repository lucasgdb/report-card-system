import useMediaQuery from '@mui/material/useMediaQuery';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Themes = 'light' | 'dark';

type ThemeContextProps = {
  theme: Themes;
  switchTheme(): void;
};

const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [theme, setTheme] = useState<Themes>(prefersDarkMode ? 'dark' : 'light');

  const switchTheme = useCallback(() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')), []);

  useEffect(() => {
    const switchToLight = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme('light');
      }
    };

    const switchToDark = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme('dark');
      }
    };

    const mqlLight = window.matchMedia('(prefers-color-scheme: light)');
    const mqlDark = window.matchMedia('(prefers-color-scheme: dark)');

    mqlLight.addEventListener('change', switchToLight);
    mqlDark.addEventListener('change', switchToDark);

    return () => {
      mqlLight.removeEventListener('change', switchToLight);
      mqlDark.removeEventListener('change', switchToDark);
    };
  }, [switchTheme]);

  return <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  return context;
}
