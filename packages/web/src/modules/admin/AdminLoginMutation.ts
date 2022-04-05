import { graphql } from 'relay-hooks';

const AdminLoginMutation = graphql`
  mutation AdminLoginMutation($input: AdminLoginMutationInput!) {
    adminLogin(input: $input) {
      jwtToken
    }
  }
`;

export default AdminLoginMutation;
