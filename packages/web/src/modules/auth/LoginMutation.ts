import { graphql } from 'relay-hooks';

const LoginMutation = graphql`
  mutation LoginMutation($input: LoginMutationInput!) {
    login(input: $input) {
      jwtToken
    }
  }
`;

export default LoginMutation;
