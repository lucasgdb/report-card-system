import useMediaQuery from '@mui/material/useMediaQuery';
import { PageLoader } from '@usefaz/components';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { graphql, useQuery } from 'relay-hooks';

import { ThemeContextQuery } from './__generated__/ThemeContextQuery.graphql';

type Themes = 'light' | 'dark';

type ThemeContextProps = {
  theme: Themes;
  switchTheme(): void;
};

const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider: React.FC = ({ children }) => {
  const { data, isLoading } = useQuery<ThemeContextQuery>(graphql`
    query ThemeContextQuery {
      student {
        id
      }
    }
  `);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [theme, setTheme] = useState<Themes>(prefersDarkMode ? 'dark' : 'light');

  const switchTheme = useCallback(() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')), []);

  useEffect(() => {
    if (data?.student?.id) {
      setTheme(prefersDarkMode ? 'dark' : 'light');
      return;
    }

    setTheme('light');
  }, [data, prefersDarkMode]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>;
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  return context;
}
