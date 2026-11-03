import { graphql } from 'react-relay';

const SendStudentPasswordResetLinkMutation = graphql`
  mutation SendStudentPasswordResetLinkMutation($input: SendStudentPasswordResetLinkMutationInput!) {
    sendStudentPasswordResetLink(input: $input) {
      error {
        field
        userMessage
      }
      studentPasswordRecoveryRequest {
        id
        status
      }
      admin {
        id
        pendingStudentPasswordRecoveryRequestCount
      }
    }
  }
`;

export default SendStudentPasswordResetLinkMutation;
