import { graphql, useQuery } from 'relay-hooks';
import Container from '@mui/material/Container';

import { LoginPageQuery } from './__generated__/LoginPageQuery.graphql';
import PageLoader from '~/components/PageLoader';
import LoginButton from '~/components/LoginButton';
import LogoutButton from '~/components/LogoutButton';
import Welcome from '~/components/Welcome';
import AdminLoginButton from '~/components/AdminLoginButton';

const query = graphql`
  query LoginPageQuery {
    auth {
      isLogged
    }
  }
`;

export default function LoginPage() {
  const { data, isLoading } = useQuery<LoginPageQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  if (data.auth.isLogged) {
    return (
      <Container>
        <p>Congrats, you are authenticated! :D</p>

        <Welcome />

        <LogoutButton />
      </Container>
    );
  }

  return (
    <Container>
      <p>You are not authenticated.</p>

      <LoginButton />
      <AdminLoginButton />
    </Container>
  );
}
