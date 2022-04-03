import { graphql, useQuery } from 'relay-hooks';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import { EnvironmentLayoutQuery } from './__generated__/EnvironmentLayoutQuery.graphql';
import PageLoader from '~/components/PageLoader';
import LoginPage from '~/pages/Login/LoginPage';

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
    return <LoginPage />;
  }

  return (
    <OuterEnvironmentLayout>
      <Outlet />
    </OuterEnvironmentLayout>
  );
}
