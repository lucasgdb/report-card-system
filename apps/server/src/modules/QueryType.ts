import { GraphQLObjectType } from 'graphql';

import type { IContext } from '~/interfaces';
import { nodeField, nodesField } from './node/NodeType';
import { systemField } from './system/SystemType';
import { adminField } from './admin/AdminType';
import { studentField } from './student/StudentType';

const QueryType = new GraphQLObjectType<any, IContext>({
  name: 'Query',
  fields: {
    node: nodeField,
    nodes: nodesField,
    admin: adminField,
    student: studentField,
    system: systemField,
  },
});

export default QueryType;
