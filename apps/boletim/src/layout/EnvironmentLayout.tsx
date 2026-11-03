import { session } from '@usefaz/shared/browser';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Outlet } from 'react-router';
import * as React from 'react';

import type { EnvironmentLayoutQuery } from './__generated__/EnvironmentLayoutQuery.graphql';

const LoginPage = React.lazy(() => import('~/pages/Login/LoginPage'));

export default function EnvironmentLayout() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      {/* Not signed in on this device: there's nothing to ask the server, so the login shows right away. */}
      {session.isSignedIn() ? <EnvironmentLayoutContent /> : <LoginPage />}
    </React.Suspense>
  );
}

function EnvironmentLayoutContent() {
  const data = useLazyLoadQuery<EnvironmentLayoutQuery>(
    graphql`
      query EnvironmentLayoutQuery {
        student {
          id
        }
      }
    `,
    {}
  );

  const signedIn = Boolean(data?.student);
  // The session ended (expired or signed out elsewhere): forget it, so the next visit skips the check.
  React.useEffect(() => {
    if (!signedIn) {
      session.clear();
    }
  }, [signedIn]);

  if (!data?.student) {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <LoginPage />
      </React.Suspense>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
