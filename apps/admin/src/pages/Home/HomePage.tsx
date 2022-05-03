import { PageLoader } from '@usefaz/components';
import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';

import { HomePageQuery } from './__generated__/HomePageQuery.graphql';

const query = graphql`
  query HomePageQuery {
    viewer {
      admin {
        id
      }
    }
  }
`;

const OuterHomePage = styled.div``;

export default function HomePage() {
  const { data, isLoading } = useQuery<HomePageQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  return <OuterHomePage>{data.viewer.admin.id}</OuterHomePage>;
}
