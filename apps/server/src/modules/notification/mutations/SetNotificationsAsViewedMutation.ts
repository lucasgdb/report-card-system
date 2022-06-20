import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { NotificationModel } from '~/entities';
import { NotificationConnection } from '../NotificationType';

type setNotificationsAsViewedProps = {
  notificationIds: string[];
  clientMutationId: string;
};

const setNotificationsAsViewed = async ({
  notificationIds: globalNotificationIds,
  clientMutationId,
}: setNotificationsAsViewedProps) => {
  const notificationIds = globalNotificationIds.map((globalNotificationId) => fromGlobalId(globalNotificationId).id);

  const notificationEntity = NotificationModel(usefazConnector);
  const notifications = await notificationEntity.setNotificationsAsViewed(notificationIds);

  const notificationEdges = notifications.map((notification) => ({ node: notification }));

  return {
    notifications: { edges: notificationEdges },
    clientMutationId,
  };
};

export default mutationWithClientMutationId({
  name: 'SetNotificationsAsViewedMutation',
  inputFields: {
    notificationIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
  },
  outputFields: {
    notifications: {
      type: NotificationConnection.connectionType,
    },
  },
  mutateAndGetPayload: setNotificationsAsViewed,
});
