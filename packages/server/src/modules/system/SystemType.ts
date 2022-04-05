import { GraphQLInt, GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';

const SystemType = new GraphQLObjectType<unknown, IContext>({
  name: 'System',
  fields() {
    return {
      test: {
        type: GraphQLInt,
        resolve() {
          return 1;
        },
      },
    };
  },
});

export const systemField = {
  type: SystemType,
  resolve() {
    return {};
  },
};

export default SystemType;
