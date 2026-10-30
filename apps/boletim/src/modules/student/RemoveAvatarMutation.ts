import { graphql } from 'react-relay';

const RemoveAvatarMutation = graphql`
  mutation RemoveAvatarMutation($input: RemoveAvatarMutationInput!) {
    removeAvatar(input: $input) {
      error {
        field
        userMessage
      }
      student {
        avatarURL
      }
    }
  }
`;

export default RemoveAvatarMutation;
