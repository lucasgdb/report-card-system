import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import type { IAdmin, IContext } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';

const AdminType = registerGraphQLNodeObjectType<IAdmin>('admin')({
  name: 'Admin',
  fields() {
    return {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
  },
});

export const AdminConnection = connectionDefinitions({
  name: 'Admin',
  nodeType: AdminType,
});

export const adminField = {
  type: AdminType,
  resolve(_root: IAdmin | undefined, _args: unknown, context: IContext) {
    return context.admin;
  },
};

export default AdminType;
