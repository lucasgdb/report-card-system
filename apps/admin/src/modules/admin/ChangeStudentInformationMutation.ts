import { graphql } from 'react-relay';

const ChangeStudentInformationMutation = graphql`
  mutation ChangeStudentInformationMutation($input: ChangeStudentInformationMutationInput!) {
    changeStudentInformation(input: $input) {
      error {
        field
        userMessage
      }
      student {
        id
        RM
        fullname
      }
    }
  }
`;

export default ChangeStudentInformationMutation;
