import { graphql } from 'react-relay';

const SetNotificationsAsViewedMutation = graphql`
  mutation SetNotificationsAsViewedMutation($input: SetNotificationsAsViewedMutationInput!) {
    setNotificationsAsViewed(input: $input) {
      error {
        field
        userMessage
      }
      notifications {
        edges {
          node {
            id
            viewed
          }
        }
      }
    }
  }
`;

export default SetNotificationsAsViewedMutation;
