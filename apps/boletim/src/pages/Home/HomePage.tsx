import { PageLoader } from '@usefaz/components';
import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { HomePageQuery } from './__generated__/HomePageQuery.graphql';
import Menu from '~/components/Menu/Menu';
import Profile from '~/components/Home/Profile/Profile';
import Boletim from '~/components/Home/Boletim/Boletim';

const query = graphql`
  query HomePageQuery {
    student {
      ...Menu_student
      ...Profile_student
    }
  }
`;

const OuterHomePage = styled.div``;

export default function HomePage() {
  const { data, isLoading } = useQuery<HomePageQuery>(query);

  useEffect(() => {
    document.title = 'Boletim | Usefaz';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterHomePage>
      <Menu student={data.student} />
      <Profile student={data.student} />
      <Boletim />
    </OuterHomePage>
  );
}
