import { graphql } from 'react-relay';

const LogoutMutation = graphql`
  mutation LogoutMutation($input: LogoutMutationInput!) {
    logout(input: $input) {
      error {
        field
        userMessage
      }
    }
  }
`;

export default LogoutMutation;
