import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';

const StudentAuthType = new GraphQLObjectType<unknown, IContext>({
  name: 'StudentAuth',
  fields() {
    return {
      isLogged: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    };
  },
});

export const studentAuthField = {
  type: new GraphQLNonNull(StudentAuthType),
  resolve(_root: unknown, _args: unknown, context: IContext) {
    if (!context.student) {
      return { isLogged: false, user: null };
    }

    return {
      isLogged: true,
    };
  },
};

export default StudentAuthType;
