import { GraphQLNonNull } from 'graphql';

import type { IAdminPasswordRecoveryRequest } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import AdminPasswordRecoveryRequestStatusEnum from './enums/AdminPasswordRecoveryRequestStatusEnum';

const AdminPasswordRecoveryRequestType = registerGraphQLNodeObjectType<IAdminPasswordRecoveryRequest>(
  'admin_password_recovery_request'
)({
  name: 'AdminPasswordRecoveryRequest',
  fields() {
    return {
      status: {
        type: new GraphQLNonNull(AdminPasswordRecoveryRequestStatusEnum),
      },
    };
  },
});

export default AdminPasswordRecoveryRequestType;
