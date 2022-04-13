import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';

import { HomePageQuery } from './__generated__/HomePageQuery.graphql';
import PageLoader from '~/components/PageLoader';
import Menu from '~/components/Home/Menu/Menu';
import Profile from '~/components/Home/Profile/Profile';
import Boletim from '~/components/Home/Boletim/Boletim';

const query = graphql`
  query HomePageQuery {
    viewer {
      student {
        ...Menu_student
        ...Profile_student
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

  return (
    <OuterHomePage>
      <Menu student={data.viewer.student} />
      <Profile student={data.viewer.student} />
      <Boletim />
    </OuterHomePage>
  );
}
