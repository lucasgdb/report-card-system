import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';
import UserType from '../user/UserType';

const AuthType = new GraphQLObjectType<unknown, IContext>({
  name: 'Auth',
  fields() {
    return {
      isLogged: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      user: {
        type: UserType,
      },
    };
  },
});

export const authField = {
  type: new GraphQLNonNull(AuthType),
  resolve(_root: unknown, _args: unknown, context: IContext) {
    if (!context.user?.id) {
      return { isLogged: false, user: null };
    }

    return {
      isLogged: true,
      user: context.user,
    };
  },
};

export default AuthType;
