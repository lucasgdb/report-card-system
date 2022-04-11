import { graphql, useQuery } from 'relay-hooks';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import * as React from 'react';

import { EnvironmentLayoutQuery } from './__generated__/EnvironmentLayoutQuery.graphql';
import PageLoader from '~/components/PageLoader';

const query = graphql`
  query EnvironmentLayoutQuery {
    auth {
      isLogged
    }
  }
`;

const OuterEnvironmentLayout = styled.div``;

export default function EnvironmentLayout() {
  const { data, isLoading } = useQuery<EnvironmentLayoutQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data?.auth?.isLogged) {
    const LoginPage = React.lazy(() => import('~/pages/Login/LoginPage'));
    return (
      <React.Suspense fallback={<PageLoader />}>
        <LoginPage />
      </React.Suspense>
    );
  }

  return (
    <OuterEnvironmentLayout>
      <Outlet />
    </OuterEnvironmentLayout>
  );
}
