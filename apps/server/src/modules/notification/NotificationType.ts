import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import dayjs from 'dayjs';

import type { INotification } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';

const NotificationType = registerGraphQLNodeObjectType<INotification>('notification')({
  name: 'Notification',
  fields() {
    return {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
      viewed: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      sentAt: {
        type: new GraphQLNonNull(GraphQLString),
        resolve(notification) {
          return dayjs(notification.created_at).format();
        },
      },
    };
  },
});

export const NotificationConnection = connectionDefinitions({
  name: 'Notification',
  nodeType: NotificationType,
  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default NotificationType;
