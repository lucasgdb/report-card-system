import { graphql } from 'relay-hooks';

const SendStudentPasswordRecoveryRequestMutation = graphql`
  mutation SendStudentPasswordRecoveryRequestMutation($input: SendStudentPasswordRecoveryRequestMutationInput!) {
    sendStudentPasswordRecoveryRequest(input: $input) {
      clientMutationId
    }
  }
`;

export default SendStudentPasswordRecoveryRequestMutation;
