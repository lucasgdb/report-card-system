import { graphql } from 'react-relay';

const RefuseStudentPasswordRecoveryRequestMutation = graphql`
  mutation RefuseStudentPasswordRecoveryRequestMutation($input: RefuseStudentPasswordRecoveryRequestMutationInput!) {
    refuseStudentPasswordRecoveryRequest(input: $input) {
      error {
        field
        userMessage
      }
      studentPasswordRecoveryRequest {
        id
        status
      }
    }
  }
`;

export default RefuseStudentPasswordRecoveryRequestMutation;
