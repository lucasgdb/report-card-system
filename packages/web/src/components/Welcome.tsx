import { graphql, useQuery } from 'relay-hooks';
import styled from 'styled-components';

import { WelcomeQuery } from './__generated__/WelcomeQuery.graphql';

const OuterWelcome = styled.div``;

const query = graphql`
  query WelcomeQuery {
    viewer {
      student {
        RM
        fullname
      }

      admin {
        email
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
    <OuterWelcome>
      <p>Your RM: {data.viewer.student.RM}</p>

      <p>Welcome, {data.viewer.student.fullname}</p>
      <p>{data.viewer.admin?.email}</p>
    </OuterWelcome>
  );
}
