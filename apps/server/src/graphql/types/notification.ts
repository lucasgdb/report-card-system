import builder, { orderByIds, toRowIds } from '#/graphql/builder.ts';
import { findNotificationsByIds, type NotificationRow } from '#/repositories/notifications.ts';

export const NotificationRef = builder.objectRef<NotificationRow>('Notification');

builder.node(NotificationRef, {
  id: { resolve: (notification) => notification.id },
  loadMany: async (ids, ctx) =>
    ctx.viewer?.admin ? orderByIds(ids, await findNotificationsByIds(toRowIds(ids))) : ids.map(() => null),
  fields: (t) => ({
    title: t.exposeString('title'),
    message: t.exposeString('message'),
    viewed: t.boolean({ resolve: (notification) => Boolean(notification.viewed) }),
    sentAt: t.string({ resolve: (notification) => notification.created_at.toISOString() }),
  }),
});

export const NotificationConnection = builder.connectionObject(
  {
    type: NotificationRef,
    name: 'NotificationConnection',
    // The number of items in this page of the connection.
    fields: (t) => ({
      count: t.int({ resolve: (connection) => (Array.isArray(connection.edges) ? connection.edges.length : 0) }),
    }),
  },
  { name: 'NotificationEdge' }
);
