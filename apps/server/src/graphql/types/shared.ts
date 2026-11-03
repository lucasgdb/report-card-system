import builder from '#/graphql/builder.ts';
import type { MutationErrorShape } from '#/graphql/errors.ts';

/** First word of a full name. */
export const firstName = (fullname: string) => fullname.trim().split(/\s+/)[0];

/** Last word of a full name, or null for a single-word name. */
export const lastName = (fullname: string) => {
  const parts = fullname.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

export const MutationErrorRef = builder.objectRef<MutationErrorShape>('MutationError').implement({
  description: 'An expected failure of a mutation, written for the user.',
  fields: (t) => ({
    field: t.exposeString('field', {
      nullable: true,
      description: 'Input field the error refers to; null when it concerns the whole operation.',
    }),
    userMessage: t.exposeString('userMessage', { description: 'Message to show as is (pt-BR).' }),
  }),
});
