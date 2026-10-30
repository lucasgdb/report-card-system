import { environment } from '@usefaz/relay';
import { jwtToken } from '@usefaz/shared/browser';
import { fetchQuery } from 'react-relay';

import NavbarLayoutQuery from '~/layout/Navbar/__generated__/NavbarLayoutQuery.graphql';
import StudentListPageQuery from '~/pages/StudentList/__generated__/StudentListPageQuery.graphql';

/**
 * Starts loading the first screen while the app boots, so its code (and, signed in, its data) arrives
 * in parallel with the session check instead of one request after another. Relay dedupes the queries
 * with the pages' own `useLazyLoadQuery`.
 */
export function preloadFirstScreen() {
  if (!jwtToken.get()) {
    void import('~/pages/Login/LoginPage');
    return;
  }

  void import('~/layout/Navbar/NavbarLayout');
  fetchQuery(environment, NavbarLayoutQuery, { count: 5 }).subscribe({});

  if (window.location.hash.replace(/^#\/?/, '') === '') {
    void import('~/pages/StudentList/StudentListPage');
    fetchQuery(environment, StudentListPageQuery, {}).subscribe({});
  }
}
