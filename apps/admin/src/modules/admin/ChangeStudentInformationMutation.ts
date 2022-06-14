import { graphql } from 'relay-hooks';

const ChangeStudentInformationMutation = graphql`
  mutation ChangeStudentInformationMutation($input: ChangeStudentInformationMutationInput!) {
    changeStudentInformation(input: $input) {
      student {
        id
        RM
        fullname
      }
    }
  }
`;

export default ChangeStudentInformationMutation;
