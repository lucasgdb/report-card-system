import { environment } from '@usefaz/relay';
import { jwtToken } from '@usefaz/shared/browser';
import { fetchQuery } from 'react-relay';

import HomePageQuery from '~/pages/Home/__generated__/HomePageQuery.graphql';

/**
 * Starts loading the first screen while the app boots, so its code (and, signed in, its data) arrives
 * in parallel with the session check instead of one request after another. Relay dedupes the query
 * with the page's own `useLazyLoadQuery`.
 */
export function preloadFirstScreen() {
  if (!jwtToken.get()) {
    void import('~/pages/Login/LoginPage');
    return;
  }

  if (window.location.hash.replace(/^#\/?/, '') === '') {
    void import('~/pages/Home/HomePage');
    fetchQuery(environment, HomePageQuery, {}).subscribe({});
  }
}
