import { graphql } from 'relay-hooks';

const RemoveStudentMutation = graphql`
  mutation RemoveStudentMutation($input: RemoveStudentMutationInput!) {
    removeStudent(input: $input) {
      student {
        id
      }
    }
  }
`;

export default RemoveStudentMutation;
