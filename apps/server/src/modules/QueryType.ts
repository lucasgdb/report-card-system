import { GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';
import { authField } from './auth/AuthType';
import { nodeField, nodesField } from './node/NodeType';
import { systemField } from './system/SystemType';
import { viewerField } from './user/UserType';

const QueryType = new GraphQLObjectType<any, IContext>({
  name: 'Query',
  fields: {
    auth: authField,
    node: nodeField,
    nodes: nodesField,
    viewer: viewerField,
    system: systemField,
  },
});

export default QueryType;
