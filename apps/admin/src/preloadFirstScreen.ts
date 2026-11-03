import { environment } from '@usefaz/relay';
import { session } from '@usefaz/shared/browser';
import { fetchQuery } from 'react-relay';

import AdminLayoutQuery from '~/layout/__generated__/AdminLayoutQuery.graphql';
import StudentListPageQuery from '~/pages/StudentList/__generated__/StudentListPageQuery.graphql';

/**
 * Starts loading the first screen while the app boots, so its code (and, signed in, its data) arrives
 * in parallel with the session check instead of one request after another. Relay dedupes the queries
 * with the pages' own `useLazyLoadQuery`.
 */
export function preloadFirstScreen() {
  if (!session.isSignedIn()) {
    void import('~/pages/Login/LoginPage');
    return;
  }

  void import('~/layout/AdminLayout');
  fetchQuery(environment, AdminLayoutQuery, { count: 5 }).subscribe({});

  if (window.location.hash.replace(/^#\/?/, '') === '') {
    void import('~/pages/StudentList/StudentListPage');
    fetchQuery(environment, StudentListPageQuery, {}).subscribe({});
  }
}
