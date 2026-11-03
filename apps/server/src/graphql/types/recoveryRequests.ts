import builder, { orderByIds, toRowIds } from '#/graphql/builder.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import {
  type AdminPasswordResetRow,
  findAdminResetsByIds,
  findStudentRequestsByIds,
  type StudentRecoveryRequestRow,
} from '#/repositories/recoveryRequests.ts';
import { findStudentsByRMs } from '#/repositories/students.ts';

const StudentPasswordRecoveryRequestStatusEnum = builder.enumType('StudentPasswordRecoveryRequestStatusEnum', {
  values: {
    PENDING: { description: 'Waiting for an admin.' },
    LINK_SENT: { description: 'Approved: the student got a link to choose a new password.' },
    CHANGED: { description: 'The student chose a new password.' },
    REFUSED: {},
  } as const,
});

export const StudentPasswordRecoveryRequestRef = builder.objectRef<StudentRecoveryRequestRow>(
  'StudentPasswordRecoveryRequest'
);

builder.node(StudentPasswordRecoveryRequestRef, {
  id: { resolve: (request) => request.id },
  loadMany: async (ids, ctx) =>
    ctx.viewer?.admin ? orderByIds(ids, await findStudentRequestsByIds(toRowIds(ids))) : ids.map(() => null),
  fields: (t) => ({
    RM: t.exposeString('rm'),
    email: t.exposeString('email'),
    createdAt: t.string({ resolve: (request) => request.created_at.toISOString() }),
    status: t.field({ type: StudentPasswordRecoveryRequestStatusEnum, resolve: (request) => request.status }),
    // Batched: the admin's list loads every request's student in one query. Null once the student is removed.
    student: t.loadable({
      type: StudentRef,
      nullable: true,
      load: async (rms: string[]) => {
        const students = await findStudentsByRMs(rms);
        const byRM = new Map(students.map((student) => [student.rm, student]));
        return rms.map((rm) => byRM.get(rm) ?? null) as never;
      },
      resolve: (request) => request.rm,
    }),
  }),
});

export const StudentPasswordRecoveryRequestConnection = builder.connectionObject(
  { type: StudentPasswordRecoveryRequestRef, name: 'StudentPasswordRecoveryRequestConnection' },
  { name: 'StudentPasswordRecoveryRequestEdge' }
);

const AdminPasswordRecoveryRequestStatusEnum = builder.enumType('AdminPasswordRecoveryRequestStatusEnum', {
  values: ['PENDING', 'CHANGED'] as const,
});

/** An admin's password reset link. */
export const AdminPasswordRecoveryRequestRef = builder.objectRef<AdminPasswordResetRow>('AdminPasswordRecoveryRequest');

// Public: the reset page checks a link's status before showing the form (it exposes nothing else).
// Expired links are not found, like links that never existed.
builder.node(AdminPasswordRecoveryRequestRef, {
  id: { resolve: (reset) => reset.id },
  loadMany: async (ids) =>
    orderByIds(ids, await findAdminResetsByIds(toRowIds(ids))).map((reset) =>
      reset && reset.expires_at > new Date() ? reset : null
    ),
  fields: (t) => ({
    status: t.field({
      type: AdminPasswordRecoveryRequestStatusEnum,
      resolve: (reset) => (reset.used_at ? 'CHANGED' : 'PENDING'),
    }),
  }),
});
