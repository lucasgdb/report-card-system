import { graphql } from 'relay-hooks';

const SendStudentRecoveryEmailMutation = graphql`
  mutation SendStudentRecoveryEmailMutation($input: SendStudentRecoveryEmailMutationInput!) {
    sendStudentRecoveryEmail(input: $input) {
      clientMutationId
    }
  }
`;

export default SendStudentRecoveryEmailMutation;
