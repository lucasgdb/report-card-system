import { jwtToken } from '@usefaz/shared/browser';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Outlet } from 'react-router';
import * as React from 'react';

import type { EnvironmentLayoutQuery } from './__generated__/EnvironmentLayoutQuery.graphql';

const LoginPage = React.lazy(() => import('~/pages/Login/LoginPage'));

export default function EnvironmentLayout() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      {/* Without a session cookie there's nothing to ask the server: the login shows right away. */}
      {jwtToken.get() ? <EnvironmentLayoutContent /> : <LoginPage />}
    </React.Suspense>
  );
}

function EnvironmentLayoutContent() {
  const data = useLazyLoadQuery<EnvironmentLayoutQuery>(
    graphql`
      query EnvironmentLayoutQuery {
        admin {
          id
        }
      }
    `,
    {}
  );

  if (!data?.admin?.id) {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <LoginPage />
      </React.Suspense>
    );
  }

  return <Outlet />;
}
