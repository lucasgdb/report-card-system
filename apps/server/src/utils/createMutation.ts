import { mutationWithClientMutationId } from 'graphql-relay';

import MutationErrorType from '~/modules/error/MutationErrorType';
import UserError from './UserError';

// Same defaults as graphql-relay's own (non-exported) MutationConfig.
type MutationConfig = Parameters<typeof mutationWithClientMutationId<any, unknown, any>>[0];

/**
 * A Relay mutation whose payload also has `error: MutationError`. Throw a `UserError` from
 * `mutateAndGetPayload` for failures the user can fix: it becomes `error { field, userMessage }` (the
 * other payload fields are null). Other errors are unexpected and surface as GraphQL errors.
 */
export default function createMutation(config: MutationConfig) {
  const { outputFields, mutateAndGetPayload } = config;

  return mutationWithClientMutationId({
    ...config,
    outputFields: () => ({
      ...(typeof outputFields === 'function' ? outputFields() : outputFields),
      error: { type: MutationErrorType },
    }),
    mutateAndGetPayload: async (input, context, info) => {
      try {
        return await mutateAndGetPayload(input, context, info);
      } catch (error) {
        if (error instanceof UserError) {
          return { error: { field: error.field, userMessage: error.userMessage } };
        }
        throw error;
      }
    },
  });
}
