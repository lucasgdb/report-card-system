import { GraphQLSchema } from 'graphql';

import MutationType from './MutationType';
import QueryType from './QueryType';

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
