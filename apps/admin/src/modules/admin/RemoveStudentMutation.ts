import { graphql } from 'react-relay';

const RemoveStudentMutation = graphql`
  mutation RemoveStudentMutation($input: RemoveStudentMutationInput!, $connections: [ID!]!) {
    removeStudent(input: $input) {
      error {
        field
        userMessage
      }
      student {
        id @deleteEdge(connections: $connections)
      }
    }
  }
`;

export default RemoveStudentMutation;
