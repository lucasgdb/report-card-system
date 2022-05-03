import { graphql } from 'relay-hooks';

const SendRecoveryEmailMutation = graphql`
  mutation SendRecoveryEmailMutation($input: SendRecoveryEmailMutationInput!) {
    sendRecoveryEmail(input: $input) {
      clientMutationId
    }
  }
`;

export default SendRecoveryEmailMutation;
