import { graphql } from 'react-relay';

const ResetStudentPasswordMutation = graphql`
  mutation ResetStudentPasswordMutation($input: ResetStudentPasswordMutationInput!) {
    resetStudentPassword(input: $input) {
      error {
        field
        userMessage
      }
    }
  }
`;

export default ResetStudentPasswordMutation;
