import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel, StudentPasswordRecoveryRequestModel } from '~/entities';
import type { IAdmin, IContext } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import { StudentPasswordRecoveryRequestConnection } from '../student/StudentPasswordRecoveryRequestType';
import { StudentConnection } from '../student/StudentType';

const AdminType = registerGraphQLNodeObjectType<IAdmin>('admin')({
  name: 'Admin',
  fields() {
    return {
      email: {
        type: new GraphQLNonNull(GraphQLString),
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
