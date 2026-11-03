import { graphql } from 'react-relay';

const AdminLoginMutation = graphql`
  mutation AdminLoginMutation($input: AdminLoginMutationInput!) {
    adminLogin(input: $input) {
      error {
        field
        userMessage
      }
      admin {
        id
      }
    }
  }
`;

export default AdminLoginMutation;
