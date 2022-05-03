import { GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';
import { studentAuthField } from './auth/StudentAuthType';
import { adminAuthField } from './auth/AdminAuthType';
import { nodeField, nodesField } from './node/NodeType';
import { systemField } from './system/SystemType';
import { viewerField } from './user/UserType';

const QueryType = new GraphQLObjectType<any, IContext>({
  name: 'Query',
  fields: {
    studentAuth: studentAuthField,
    adminAuth: adminAuthField,
    node: nodeField,
    nodes: nodesField,
    viewer: viewerField,
    system: systemField,
  },
});

export default QueryType;
