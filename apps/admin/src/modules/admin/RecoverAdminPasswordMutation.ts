import { graphql } from 'relay-hooks';

const RecoverAdminPasswordMutation = graphql`
  mutation RecoverAdminPasswordMutation($input: RecoverAdminPasswordMutationInput!) {
    recoverAdminPassword(input: $input) {
      clientMutationId
    }
  }
`;

export default RecoverAdminPasswordMutation;
