import { graphql } from 'relay-hooks';

const SendAdminRecoveryEmailMutation = graphql`
  mutation SendAdminRecoveryEmailMutation($input: SendAdminRecoveryEmailMutationInput!) {
    sendAdminRecoveryEmail(input: $input) {
      clientMutationId
    }
  }
`;

export default SendAdminRecoveryEmailMutation;
