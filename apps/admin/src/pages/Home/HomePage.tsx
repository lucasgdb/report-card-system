import { PageLoader } from '@usefaz/components';
import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { HomePageQuery } from './__generated__/HomePageQuery.graphql';
import LogoutButton from '~/components/Home/LogoutButton';

const query = graphql`
  query HomePageQuery {
    admin {
      id
    }
  }
`;

const OuterHomePage = styled.div`
  padding: 8px 24px;
`;

const AdminIDText = styled.p`
  font: normal normal normal 16px/19px Lexend;
  margin: 0 0 8px;
`;

export default function HomePage() {
  const { data, isLoading } = useQuery<HomePageQuery>(query);

  useEffect(() => {
    document.title = 'Página Principal | Usefaz';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterHomePage>
      <AdminIDText>Admin ID: {data.admin.id}</AdminIDText>
      <LogoutButton />
    </OuterHomePage>
  );
}
