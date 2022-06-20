import type { RequiredExceptFor } from '@usefaz/shared';
import type { Knex } from 'knex';
import type { DBConnector } from '~/database/dbConnector';
import usefazConnector from '~/database/usefazConnector';
import type { INotification } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';

const NotificationModel = (dbConnector: DBConnector) => {
  return {
    async createNotification(
      notification: RequiredExceptFor<INotification, 'id' | 'viewed' | 'created_at' | 'updated_at'>,
      trx: Knex.Transaction
    ) {
      const [newNotification] = await callTrxOrKnexConnection<INotification>('notification', usefazConnector, trx)
        .insert(notification)
        .returning('*');

      return newNotification;
    },

    getAll() {
      return dbConnector
        .knexConnection('notification')
        .orderByRaw('CASE WHEN viewed IS FALSE THEN 0 ELSE 1 END')
        .orderBy('created_at', 'DESC');
    },

    setNotificationsAsViewed(ids: string[]) {
      return dbConnector.knexConnection('notification').update('viewed', true).whereIn('id', ids).returning('*');
    },
  };
};

export default NotificationModel;
