import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import type { IStudent } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';

const StudentType = registerGraphQLNodeObjectType<IStudent>('student')({
  name: 'Student',
  fields() {
    return {
      RM: {
        type: new GraphQLNonNull(GraphQLString),
      },
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (student) => {
          const [firstName] = student.fullname.split(' ');
          return firstName;
        },
      },
      fullname: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
  },
});

export const StudentConnection = connectionDefinitions({
  name: 'Student',
  nodeType: StudentType,
});

export default StudentType;
