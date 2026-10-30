import jwtToken from './jwtToken';
import fetchWithRetries, { HttpError } from '../utils/fetchWithRetries';

type AuthorizedFetchOptions = Parameters<typeof fetchWithRetries>[1] & {
  headers?: Record<string, string>;
};

/**
 * Calls the Usefaz server as the signed-in user (browser only). A 401 means the session expired, so
 * the page reloads into the login.
 */
export default async function authorizedFetch(url: string, { headers, ...init }: AuthorizedFetchOptions = {}) {
  try {
    return await fetchWithRetries(url, { ...init, headers: { ...headers, Authorization: jwtToken.get() } });
  } catch (error) {
    if (error instanceof HttpError && error.response.status === 401) {
      window.location.reload();
    }
    throw error;
  }
}
