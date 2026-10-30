import { graphql } from 'react-relay';

const SendAdminRecoveryEmailMutation = graphql`
  mutation SendAdminRecoveryEmailMutation($input: SendAdminRecoveryEmailMutationInput!) {
    sendAdminRecoveryEmail(input: $input) {
      error {
        field
        userMessage
      }
    }
  }
`;

export default SendAdminRecoveryEmailMutation;
