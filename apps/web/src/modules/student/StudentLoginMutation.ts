import { graphql } from 'relay-hooks';

const StudentLoginMutation = graphql`
  mutation StudentLoginMutation($input: StudentLoginMutationInput!) {
    studentLogin(input: $input) {
      jwtToken
    }
  }
`;

export default StudentLoginMutation;
