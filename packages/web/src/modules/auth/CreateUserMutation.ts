import { graphql } from 'relay-hooks';

const CreateUserMutation = graphql`
  mutation CreateUserMutation($input: CreateUserMutationInput!) {
    createUser(input: $input) {
      jwtToken
    }
  }
`;

export default CreateUserMutation;
