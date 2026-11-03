import { GraphQLError } from 'graphql';
import type { z } from 'zod';

/**
 * An expected failure the user can fix (wrong password, RM already taken…). Mutations return it as
 * `error { field, userMessage }`: the client shows `userMessage` on `field` (an input field name) or,
 * without a field, for the whole form. Anything else thrown is unexpected and reaches the client masked.
 */
export class UserError extends Error {
  readonly userMessage: string;
  readonly field: string | null;

  constructor(userMessage: string, field: string | null = null) {
    super(userMessage);
    this.name = 'UserError';
    this.userMessage = userMessage;
    this.field = field;
  }
}

export type MutationErrorShape = { field: string | null; userMessage: string };

/** A mutation's payload: its fields on success, or just `error`. */
export type Payload<T extends object = object> = Partial<T> & { error?: MutationErrorShape };

/** Runs a mutation, turning a `UserError` into the payload's `error` (and other fields null). */
export async function withUserErrors<T extends object>(run: () => Promise<T>): Promise<Payload<T>> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof UserError) {
      return { error: { field: error.field, userMessage: error.userMessage } } as Payload<T>;
    }
    throw error;
  }
}

/** Validates input with a Zod schema; the first problem becomes a `UserError` on its field. */
export function parseInput<Schema extends z.ZodType>(schema: Schema, input: unknown): z.output<Schema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const [issue] = result.error.issues;
    throw new UserError(issue.message, typeof issue.path[0] === 'string' ? issue.path[0] : null);
  }
  return result.data;
}

/** The request needs a session it doesn't have (or a different kind of user). */
export const unauthenticated = () =>
  new GraphQLError('Sua sessão expirou. Entre novamente.', { extensions: { code: 'UNAUTHENTICATED' } });
