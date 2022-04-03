import { graphql, useQuery } from 'relay-hooks';
import Container from '@mui/material/Container';

import Welcome from '~/components/Home/Welcome';
import { HomePageQuery } from './__generated__/HomePageQuery.graphql';
import PageLoader from '~/components/PageLoader';
import { DefaultErrorPage } from '@usefaz/components';
import Articles from '~/components/Home/Articles';

const query = graphql`
  query HomePageQuery {
    viewer {
      ...Welcome_viewer
    }

    system {
      ...Articles_system
    }
  }
`;

export default function HomePage() {
  const { data, error, isLoading } = useQuery<HomePageQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <DefaultErrorPage
        title="Ooops!"
        description="There was a problem."
        information={`A server error has occurred. Error code: ${error.message}`}
        actionText="Try again"
        onActionClick={() => window.location.reload()}
        disableOptionalButton
      />
    );
  }

  return (
    <Container>
      <Welcome viewer={data!.viewer} />
      <Articles system={data!.system!} />
    </Container>
  );
}
