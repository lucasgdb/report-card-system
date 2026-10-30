import { graphql } from 'react-relay';

const StudentLoginMutation = graphql`
  mutation StudentLoginMutation($input: StudentLoginMutationInput!) {
    studentLogin(input: $input) {
      error {
        field
        userMessage
      }
      jwtToken
    }
  }
`;

export default StudentLoginMutation;
