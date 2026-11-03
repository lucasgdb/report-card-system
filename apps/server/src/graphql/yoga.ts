import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { GraphQLError } from 'graphql';
import { createYoga, maskError } from 'graphql-yoga';

import { isDev } from '#/env.ts';
import type { GraphQLContext } from '#/graphql/context.ts';
import { getPersistedOperation } from '#/graphql/persistedOperations.ts';
import schema, { writeSchemaFile } from '#/graphql/schema.ts';
import logger from '#/logger.ts';

if (isDev) {
  await writeSchemaFile();
}

const yoga = createYoga<GraphQLContext>({
  schema,
  graphqlEndpoint: '/graphql',
  // CORS is handled by Hono, for every route.
  cors: false,
  landingPage: false,
  // GraphiQL (and any ad-hoc query) only in development.
  graphiql: isDev,
  logging: false,
  // Unexpected errors reach the client as "Unexpected error."; the details go to the log.
  maskedErrors: {
    maskError(error, message, isDevMode) {
      // GraphQL errors are expected (validation, unauthenticated, persisted-only); anything else is a bug.
      const original = error instanceof GraphQLError ? error.originalError : error;
      if (original && !(original instanceof GraphQLError)) {
        logger.error({ err: original }, 'unexpected error in a resolver');
      }
      return maskError(error, message, isDevMode);
    },
  },
  plugins: [
    usePersistedOperations({
      getPersistedOperation,
      allowArbitraryOperations: isDev,
      skipDocumentValidation: true,
    }),
  ],
});

export default yoga;
