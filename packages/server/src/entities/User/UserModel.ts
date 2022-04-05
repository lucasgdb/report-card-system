import type { Knex } from 'knex';
import type { DBConnector } from '~/database/dbConnector';
import type { IUser } from '~/interfaces';
import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';

const UserModel = (dbConnector: DBConnector) => {
  return {
    async insert(user: IUser, trx?: Knex.Transaction) {
      const [newUser] = await callTrxOrKnexConnection<IUser>('user', dbConnector, trx).insert(user).returning('*');
      return newUser;
    },

    getUserById(id: string) {
      return dbConnector.knexConnection<IUser>('user').where('id', id).first();
    },
  };
};

export default UserModel;
