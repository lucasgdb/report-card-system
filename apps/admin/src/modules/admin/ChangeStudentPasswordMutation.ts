import { graphql } from 'react-relay';

const ChangeStudentPasswordMutation = graphql`
  mutation ChangeStudentPasswordMutation($input: ChangeStudentPasswordMutationInput!) {
    changeStudentPassword(input: $input) {
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

export default ChangeStudentPasswordMutation;
