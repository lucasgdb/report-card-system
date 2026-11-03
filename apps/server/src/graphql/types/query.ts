import { decodeGlobalID } from '@pothos/plugin-relay';

import { hashToken } from '#/auth/tokens.ts';
import builder from '#/graphql/builder.ts';
import { AdminRef } from '#/graphql/types/admin.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import { findUsableStudentRequest } from '#/repositories/recoveryRequests.ts';

const SystemRef = builder.objectRef<Record<string, never>>('System').implement({
  fields: (t) => ({ test: t.int({ nullable: true, resolve: () => 1 }) }),
});

builder.queryFields((t) => ({
  admin: t.field({ type: AdminRef, nullable: true, resolve: (_root, _args, ctx) => ctx.viewer?.admin ?? null }),
  student: t.field({ type: StudentRef, nullable: true, resolve: (_root, _args, ctx) => ctx.viewer?.student ?? null }),
  system: t.field({ type: SystemRef, nullable: true, resolve: () => ({}) }),
  isStudentPasswordResetLinkValid: t.boolean({
    description: 'Whether a student password reset link (from the e-mail) can still be used.',
    args: {
      // Plain strings (not validated global IDs): a mangled link is just invalid, not an error.
      studentPasswordRecoveryRequestId: t.arg.id(),
      passwordRecoveryToken: t.arg.string(),
    },
    resolve: async (_root, { studentPasswordRecoveryRequestId, passwordRecoveryToken }) => {
      let id: number;
      try {
        const decoded = decodeGlobalID(String(studentPasswordRecoveryRequestId));
        id = decoded.typename === 'StudentPasswordRecoveryRequest' ? Number(decoded.id) : Number.NaN;
      } catch {
        return false;
      }
      return Number.isInteger(id) && Boolean(await findUsableStudentRequest(id, hashToken(passwordRecoveryToken)));
    },
  }),
}));
