import type { RequiredExceptFor } from '@usefaz/shared';

import type { DBConnector } from '~/database/dbConnector';
import type { IAdminPasswordRecoveryRequest } from '~/interfaces';

const AdminPasswordRecoveryRequest = (dbConnector: DBConnector) => {
  return {
    createRequest(request: RequiredExceptFor<IAdminPasswordRecoveryRequest, 'id' | 'created_at' | 'updated_at'>) {
      return dbConnector.knexConnection('admin_password_recovery_request').insert(request);
    },
  };
};

export default AdminPasswordRecoveryRequest;
