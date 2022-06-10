import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentPasswordRecoveryRequestModel } from '~/entities';
import type { IAdmin, IContext } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import { StudentPasswordRecoveryRequestConnection } from '../student/StudentPasswordRecoveryRequestType';

const AdminType = registerGraphQLNodeObjectType<IAdmin>('admin')({
  name: 'Admin',
  fields() {
    return {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      studentPasswordRecoveryRequests: {
        type: StudentPasswordRecoveryRequestConnection.connectionType,
        args: { ...connectionArgs },
        resolve: async (_admin, args) => {
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
