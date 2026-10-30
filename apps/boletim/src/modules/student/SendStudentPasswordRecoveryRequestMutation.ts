import { graphql } from 'react-relay';

const SendStudentPasswordRecoveryRequestMutation = graphql`
  mutation SendStudentPasswordRecoveryRequestMutation($input: SendStudentPasswordRecoveryRequestMutationInput!) {
    sendStudentPasswordRecoveryRequest(input: $input) {
      error {
        field
        userMessage
      }
    }
  }
`;

export default SendStudentPasswordRecoveryRequestMutation;
