import { graphql } from 'react-relay';

const StudentLoginMutation = graphql`
  mutation StudentLoginMutation($input: StudentLoginMutationInput!) {
    studentLogin(input: $input) {
      error {
        field
        userMessage
      }
      student {
        id
      }
    }
  }
`;

export default StudentLoginMutation;
