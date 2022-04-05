import type { DBConnector } from '~/database/dbConnector';
import type { IAdmin } from '~/interfaces';

const AdminModel = (dbConnector: DBConnector) => {
  return {
    getAdminByEmail(email: string) {
      return dbConnector.knexConnection<IAdmin>('admin').whereILike('email', `%${email}%`).first();
    },
    getAdminByUserId(userId: string) {
      return dbConnector.knexConnection<IAdmin>('admin').where('user_id', userId).first();
    },
  };
};

export default AdminModel;
