import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { NotificationModel, StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';
import type { IAdmin, IContext } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import { NotificationConnection } from '../notification/NotificationType';
import { StudentPasswordRecoveryRequestConnection } from '../student/StudentPasswordRecoveryRequestType';
import { StudentConnection } from '../student/StudentType';

const AdminType = registerGraphQLNodeObjectType<IAdmin>('admin')({
  name: 'Admin',
  fields() {
    return {
      firstname: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (admin) => admin.fullname.split(' ')[0],
      },
      lastname: {
        type: GraphQLString,
        description: "admin's lastname (must not be equals firstname)",
        resolve: (admin) => {
          const splittedAdminName = admin.fullname.split(' ');
          if (splittedAdminName.length === 1) {
            return null;
          }

          return splittedAdminName[splittedAdminName.length - 1];
        },
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      fullname: {
        type: new GraphQLNonNull(GraphQLString),
      },
      avatarURL: {
        type: GraphQLString,
        resolve: (admin) => admin.avatar_url,
      },
      students: {
        type: StudentConnection.connectionType,
        args: { ...connectionArgs },
        async resolve(_admin, args) {
          const studentEntity = StudentModel(usefazConnector);
          const studentList = await studentEntity.getAll();
          return connectionFromArray(studentList, args);
        },
      },
      studentPasswordRecoveryRequests: {
        type: StudentPasswordRecoveryRequestConnection.connectionType,
        args: { ...connectionArgs },
        async resolve(_admin, args) {
          const studentPasswordRecoveryRequestEntity = StudentPasswordRecoveryRequestModel(usefazConnector);
          const studentPasswordRecoveryList = await studentPasswordRecoveryRequestEntity.getAll();
          return connectionFromArray(studentPasswordRecoveryList, args);
        },
      },
      notifications: {
        type: NotificationConnection.connectionType,
        args: { ...connectionArgs },
        async resolve(_admin, args) {
          const notificationEntity = NotificationModel(usefazConnector);
          const notificationList = await notificationEntity.getAll();
          const notificationListConnection = connectionFromArray(notificationList, args);
          return { ...notificationListConnection, count: notificationListConnection.edges.length };
        },
      },
    };
  },
});

export const adminField = {
  type: AdminType,
  resolve(_root: IAdmin | undefined, _args: unknown, context: IContext) {
    return context.admin;
  },
};

export default AdminType;
