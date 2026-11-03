import builder, { requireStudent } from '#/graphql/builder.ts';
import { withUserErrors } from '#/graphql/errors.ts';
import { MutationErrorRef } from '#/graphql/types/shared.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import { updateStudent } from '#/repositories/students.ts';
import { removeQuietly } from '#/storage.ts';

builder.relayMutationField(
  'removeAvatar',
  { name: 'RemoveAvatarMutationInput', inputFields: () => ({}) },
  {
    description: "Removes the signed-in student's photo.",
    resolve: (_root, _args, ctx) =>
      withUserErrors(async () => {
        const student = requireStudent(ctx);
        const updated = await updateStudent(student.id, { avatar_url: null });
        await removeQuietly(student.avatar_url);
        return { student: updated };
      }),
  },
  {
    name: 'RemoveAvatarMutationPayload',
    outputFields: (t) => ({
      student: t.field({ type: StudentRef, nullable: true, resolve: (payload) => payload.student ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);
