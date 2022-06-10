import { graphql } from 'relay-hooks';

const RefuseStudentPasswordRecoveryRequestMutation = graphql`
  mutation RefuseStudentPasswordRecoveryRequestMutation($input: RefuseStudentPasswordRecoveryRequestMutationInput!) {
    refuseStudentPasswordRecoveryRequest(input: $input) {
      studentPasswordRecoveryRequest {
        id
        status
      }
    }
  }
`;

export default RefuseStudentPasswordRecoveryRequestMutation;
