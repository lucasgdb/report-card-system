import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import type { IAdmin } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';

const AdminType = registerGraphQLNodeObjectType<IAdmin>('admin')({
  name: 'Admin',
  fields() {
    return {
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      fullname: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
  },
});

export const AdminConnection = connectionDefinitions({
  name: 'Admin',
  nodeType: AdminType,
});

export default AdminType;
