import { graphql } from 'relay-hooks';

const LogoutMutation = graphql`
  mutation LogoutMutation($input: LogoutMutationInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;

export default LogoutMutation;
