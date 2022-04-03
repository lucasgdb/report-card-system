import type IUser from '~/models/IUser';
import type { DBConnector } from '~/database/dbConnector';

const UserModel = (dbConnector: DBConnector) => {
  return {
    async createUser(user: IUser) {
      const [newUser] = await dbConnector
        .knexConnection<IUser>('user')
        .insert({ ...user, email: user.email?.toLowerCase() })
        .returning('*');

      return newUser;
    },

    getUserByEmail(email: string) {
      return dbConnector.knexConnection<IUser>('user').whereILike('email', `%${email}%`).first();
    },

    getUserById(id: string) {
      return dbConnector.knexConnection<IUser>('user').where('id', id).first();
    },
  };
};

export default UserModel;
