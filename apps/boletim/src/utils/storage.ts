// localStorage can be unavailable (private mode, blocked site data) or hold corrupt JSON.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // Nothing to do: the data just won't be kept.
  }
}

export function readJSON<T>(key: string): T | null {
  const value = readStorage(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
