import { getSeason, getSeasonById, isSeasonId, type Season } from '@usefaz/ui/lib/seasons';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'usefaz:decoracoes';
const PREVIEW_PARAM = 'tema';

type SeasonContextValue = {
  /** The season happening now (or being previewed), even when decorations are turned off. */
  season: Season | null;
  /** Whether decorations are shown: there is a season and the user didn't turn them off. */
  enabled: boolean;
  setEnabled(enabled: boolean): void;
};

const SeasonContext = createContext<SeasonContextValue>({ season: null, enabled: false, setEnabled: () => {} });

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string | null) => {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // Storage may be unavailable (private mode); the choice then lasts for the session.
  }
};

// `?tema=natal` previews a season on any date; `?tema=off` turns decorations off.
const previewSeason = () => {
  const value = new URLSearchParams(window.location.search).get(PREVIEW_PARAM);
  if (value === 'off') {
    return null;
  }
  return isSeasonId(value) ? getSeasonById(value) : undefined;
};

type SeasonProviderProps = {
  children: React.ReactNode;
  /** Overrides today's date (tests, stories). */
  date?: Date;
};

export function SeasonProvider({ children, date }: SeasonProviderProps) {
  const season = useMemo(() => {
    const preview = previewSeason();
    return preview === undefined ? getSeason(date) : preview;
  }, [date]);

  const [userEnabled, setUserEnabled] = useState(() => readStorage(STORAGE_KEY) !== 'off');

  const setEnabled = useCallback((next: boolean) => {
    setUserEnabled(next);
    writeStorage(STORAGE_KEY, next ? null : 'off');
  }, []);

  const enabled = season !== null && userEnabled;

  // Lets CSS react to the season (e.g. `[data-season=natal] …`).
  useEffect(() => {
    const root = document.documentElement;
    if (enabled && season) {
      root.dataset.season = season.id;
    } else {
      delete root.dataset.season;
    }
  }, [enabled, season]);

  const value = useMemo(() => ({ season, enabled, setEnabled }), [season, enabled, setEnabled]);
  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export const useSeason = () => useContext(SeasonContext);
