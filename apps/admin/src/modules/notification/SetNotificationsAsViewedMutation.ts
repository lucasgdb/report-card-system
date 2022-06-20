import { graphql } from 'relay-hooks';

const SetNotificationsAsViewedMutation = graphql`
  mutation SetNotificationsAsViewedMutation($input: SetNotificationsAsViewedMutationInput!) {
    setNotificationsAsViewed(input: $input) {
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
