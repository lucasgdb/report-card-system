import { graphql } from 'relay-hooks';

const RemoveAvatarMutation = graphql`
  mutation RemoveAvatarMutation($input: RemoveAvatarMutationInput!) {
    removeAvatar(input: $input) {
      student {
        avatarURL
      }
    }
  }
`;

export default RemoveAvatarMutation;
