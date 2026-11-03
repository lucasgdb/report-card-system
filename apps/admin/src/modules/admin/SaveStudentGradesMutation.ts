import { graphql } from 'react-relay';

const SaveStudentGradesMutation = graphql`
  mutation SaveStudentGradesMutation($input: SaveStudentGradesMutationInput!) {
    saveStudentGrades(input: $input) {
      error {
        field
        userMessage
      }
      student {
        id
        ...GradesSheet_student
      }
    }
  }
`;

export default SaveStudentGradesMutation;
