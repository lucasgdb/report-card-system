import { Container } from '@mui/material';
import { graphql, useQuery } from 'relay-hooks';
import LogoutButton from './LogoutButton';

import { WelcomeQuery } from './__generated__/WelcomeQuery.graphql';

const query = graphql`
  query WelcomeQuery {
    viewer {
      student {
        RM
        fullname
      }
    }
  }
`;

export default function Welcome() {
  const { data, isLoading } = useQuery<WelcomeQuery>(query);

  if (isLoading) {
    return null;
  }

  return (
    <Container>
      <p>Seu RM: {data.viewer.student?.RM}</p>

      <p>Seja bem-vindo, {data.viewer.student?.fullname}</p>

      <LogoutButton />
    </Container>
  );
}
