/**
 * An expected failure the user can fix (wrong password, RM already taken…). Mutations created with
 * `createMutation` don't fail when one is thrown: they return it as `error { field, userMessage }`, so
 * the client shows `userMessage` on `field` (an input field name) or, without a field, for the whole form.
 * Anything else that is thrown stays a GraphQL error: an unexpected failure.
 */
export default class UserError extends Error {
  readonly userMessage: string;
  readonly field: string | null;

  constructor(userMessage: string, field: string | null = null) {
    super(userMessage);
    this.name = 'UserError';
    this.userMessage = userMessage;
    this.field = field;
  }
}
