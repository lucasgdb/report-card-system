import { graphql } from 'relay-hooks';

const ChangeStudentPasswordMutation = graphql`
  mutation ChangeStudentPasswordMutation($input: ChangeStudentPasswordMutationInput!) {
    changeStudentPassword(input: $input) {
      studentPasswordRecoveryRequest {
        id
        status
      }
    }
  }
`;

export default ChangeStudentPasswordMutation;
