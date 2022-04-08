import { GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { AdminModel, StudentModel } from '~/entities';
import type { IUser, IContext } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import getUserOrThrowError from '~/utils/getUserOrThrowError';
import AdminType from '../admin/AdminType';
import StudentType from '../student/StudentType';

const UserType = registerGraphQLNodeObjectType<IUser>('user')({
  name: 'User',
  fields() {
    return {
      student: {
        type: StudentType,
        resolve(user) {
          const studentEntity = StudentModel(usefazConnector);
          return studentEntity.getStudentBy({ user_id: user.id });
        },
      },
      admin: {
        type: AdminType,
        resolve(user) {
          const adminEntity = AdminModel(usefazConnector);
          return adminEntity.getAdminBy({ user_id: user.id });
        },
      },
    };
  },
});

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

export const viewerField = {
  type: new GraphQLNonNull(UserType),
  resolve(_root: IUser | undefined, _args: unknown, context: IContext) {
    return getUserOrThrowError(context);
  },
};

export default UserType;
