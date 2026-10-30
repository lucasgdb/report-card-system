import { GraphQLObjectType } from 'graphql';

import AdminLoginMutation from './admin/mutations/AdminLoginMutation';
import ChangeStudentInformationMutation from './admin/mutations/ChangeStudentInformationMutation';
import ChangeStudentPasswordMutation from './admin/mutations/ChangeStudentPasswordMutation';
import RecoverAdminPasswordMutation from './admin/mutations/RecoverAdminPasswordMutation';
import RefuseStudentPasswordRecoveryRequestMutation from './admin/mutations/RefuseStudentPasswordRecoveryRequestMutation';
import RemoveStudentMutation from './admin/mutations/RemoveStudentMutation';
import SendAdminRecoveryEmailMutation from './admin/mutations/SendAdminRecoveryEmailMutation';
import LogoutMutation from './auth/mutations/LogoutMutation';
import SetNotificationsAsViewedMutation from './notification/mutations/SetNotificationsAsViewedMutation';
import RemoveAvatarMutation from './student/mutations/RemoveAvatarMutation';
import SendStudentPasswordRecoveryRequestMutation from './student/mutations/SendStudentPasswordRecoveryRequestMutation';
import StudentLoginMutation from './student/mutations/StudentLoginMutation';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    adminLogin: AdminLoginMutation,
    changeStudentInformation: ChangeStudentInformationMutation,
    changeStudentPassword: ChangeStudentPasswordMutation,
    recoverAdminPassword: RecoverAdminPasswordMutation,
    refuseStudentPasswordRecoveryRequest: RefuseStudentPasswordRecoveryRequestMutation,
    removeStudent: RemoveStudentMutation,
    sendAdminRecoveryEmail: SendAdminRecoveryEmailMutation,
    logout: LogoutMutation,
    setNotificationsAsViewed: SetNotificationsAsViewedMutation,
    removeAvatar: RemoveAvatarMutation,
    sendStudentPasswordRecoveryRequest: SendStudentPasswordRecoveryRequestMutation,
    studentLogin: StudentLoginMutation,
  },
});

export default MutationType;
