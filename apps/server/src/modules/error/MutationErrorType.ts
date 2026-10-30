import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

const MutationErrorType = new GraphQLObjectType({
  name: 'MutationError',
  description: 'An expected failure of a mutation, written for the user.',
  fields: {
    field: {
      type: GraphQLString,
      description: 'Input field the error refers to; null when it concerns the whole operation.',
    },
    userMessage: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Message to show as is (pt-BR).',
    },
  },
});

export default MutationErrorType;
