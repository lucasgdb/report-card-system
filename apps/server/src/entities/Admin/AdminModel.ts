import type { RequireAtLeastOne } from '@usefaz/shared';
import type { DBConnector } from '~/database/dbConnector';
import type { IAdmin } from '~/interfaces';

const AdminModel = (dbConnector: DBConnector) => {
  return {
    getAdminBy(admin: RequireAtLeastOne<Omit<IAdmin, 'email'>>) {
      return dbConnector.knexConnection<IAdmin>('admin').where(admin).first();
    },

    getAdminByEmail(email: string) {
      return dbConnector.knexConnection<IAdmin>('admin').whereILike('email', `%${email}%`).first();
    },
  };
};

export default AdminModel;
