import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';

const AdminAuthType = new GraphQLObjectType<unknown, IContext>({
  name: 'AdminAuth',
  fields() {
    return {
      isLogged: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    };
  },
});

export const adminAuthField = {
  type: new GraphQLNonNull(AdminAuthType),
  resolve(_root: unknown, _args: unknown, context: IContext) {
    if (!context.admin) {
      return { isLogged: false, user: null };
    }

    return {
      isLogged: true,
    };
  },
};

export default AdminAuthType;
