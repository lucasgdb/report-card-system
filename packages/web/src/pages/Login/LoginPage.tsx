import { graphql, useQuery } from 'relay-hooks';
import Container from '@mui/material/Container';

import { LoginPageQuery } from './__generated__/LoginPageQuery.graphql';
import PageLoader from '~/components/PageLoader';
import { DefaultErrorPage } from '@usefaz/components';
import Articles from '~/components/Home/Articles';
import LoginButton from '~/components/LoginButton';
import RegisterButton from '~/components/RegisterButton';

const query = graphql`
  query LoginPageQuery {
    system {
      ...Articles_system
    }
  }
`;

export default function LoginPage() {
  const { data, error, isLoading } = useQuery<LoginPageQuery>(query);

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
      <p>You are not authenticated.</p>

      <LoginButton />
      <RegisterButton />

      <Articles system={data!.system!} />
    </Container>
  );
}
