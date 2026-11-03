import type { Selectable } from 'kysely';

import db, { type Transaction } from '#/database/db.ts';
import type { Notification } from '#/database/types.ts';

export type NotificationRow = Selectable<Notification>;

export const findNotificationsByIds = (ids: readonly number[]) =>
  ids.length ? db.selectFrom('notification').selectAll().where('id', 'in', ids).execute() : Promise.resolve([]);

/** Unread first, then newest first. */
export const listNotifications = () =>
  db.selectFrom('notification').selectAll().orderBy('viewed').orderBy('created_at', 'desc').execute();

export const createNotification = (trx: Transaction, values: Pick<NotificationRow, 'title' | 'message'>) =>
  trx.insertInto('notification').values(values).execute();

export const markNotificationsAsViewed = (ids: readonly number[]) =>
  ids.length
    ? db.updateTable('notification').set({ viewed: true }).where('id', 'in', ids).execute()
    : Promise.resolve();
