import fetchWithRetries, { HttpError } from '../utils/fetchWithRetries.ts';
import session from './session.ts';

type AuthorizedFetchOptions = Parameters<typeof fetchWithRetries>[1] & {
  headers?: Record<string, string>;
};

/**
 * Calls the Usefaz server as the signed-in user (browser only): sends the session cookie and says which
 * app is calling (each app has its own session). A 401 means the session ended, so the page reloads into
 * the login.
 */
export default async function authorizedFetch(url: string, { headers, ...init }: AuthorizedFetchOptions = {}) {
  try {
    return await fetchWithRetries(url, {
      ...init,
      credentials: 'include',
      headers: { ...headers, 'X-Usefaz-App': process.env.USEFAZ_APP! },
    });
  } catch (error) {
    if (error instanceof HttpError && error.response.status === 401) {
      session.clear();
      window.location.reload();
    }
    throw error;
  }
}
