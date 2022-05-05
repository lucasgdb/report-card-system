import type { RequiredExceptFor } from '@usefaz/shared';

import type { DBConnector } from '~/database/dbConnector';
import type { IAdminPasswordRecoveryRequest } from '~/interfaces';

const AdminPasswordRecoveryRequest = (dbConnector: DBConnector) => {
  return {
    createRequest(request: RequiredExceptFor<IAdminPasswordRecoveryRequest, 'id' | 'created_at' | 'updated_at'>) {
      return dbConnector
        .knexConnection<IAdminPasswordRecoveryRequest>('admin_password_recovery_request')
        .insert(request)
        .returning('*');
    },

    getRequest(id: string) {
      return dbConnector
        .knexConnection<IAdminPasswordRecoveryRequest>('admin_password_recovery_request')
        .where('id', id)
        .first();
    },

    finalizeRequest(id: string, { adminId, newPassword }: { adminId: string; newPassword: string }) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        await trx('admin_password_recovery_request').update('status', 'CHANGED').where('id', id);
        await trx('admin').update('password', newPassword).where('id', adminId);
      });
    },
  };
};

export default AdminPasswordRecoveryRequest;
