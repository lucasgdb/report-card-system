import { graphql } from 'react-relay';

const RecoverAdminPasswordMutation = graphql`
  mutation RecoverAdminPasswordMutation($input: RecoverAdminPasswordMutationInput!) {
    recoverAdminPassword(input: $input) {
      error {
        field
        userMessage
      }
    }
  }
`;

export default RecoverAdminPasswordMutation;
