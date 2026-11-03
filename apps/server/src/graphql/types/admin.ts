import { resolveArrayConnection } from '@pothos/plugin-relay';

import builder from '#/graphql/builder.ts';
import { NotificationConnection, NotificationRef } from '#/graphql/types/notification.ts';
import {
  StudentPasswordRecoveryRequestConnection,
  StudentPasswordRecoveryRequestRef,
} from '#/graphql/types/recoveryRequests.ts';
import { firstName, lastName } from '#/graphql/types/shared.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import type { AdminRow } from '#/repositories/admins.ts';
import { listNotifications } from '#/repositories/notifications.ts';
import { listDisciplines } from '#/repositories/schoolReports.ts';
import { countPendingStudentRequests, listStudentRequests } from '#/repositories/recoveryRequests.ts';
import { listStudents } from '#/repositories/students.ts';

export const StudentConnection = builder.connectionObject(
  { type: StudentRef, name: 'StudentConnection' },
  { name: 'StudentEdge' }
);

const DisciplineCodeRef = builder.objectRef<{ id: number; name: string }>('DisciplineCode').implement({
  description: 'A discipline and the code that identifies it in the grades spreadsheet.',
  fields: (t) => ({
    code: t.exposeInt('id'),
    name: t.exposeString('name'),
  }),
});

export const AdminRef = builder.objectRef<AdminRow>('Admin');

builder.node(AdminRef, {
  id: { resolve: (admin) => admin.id },
  // Only the signed-in admin can be looked up (for refetching their own data).
  loadMany: async (ids, ctx) => {
    const admin = ctx.viewer?.admin;
    return ids.map((id) => (admin && String(admin.id) === id ? admin : null));
  },
  fields: (t) => ({
    firstname: t.string({ resolve: (admin) => firstName(admin.fullname) }),
    lastname: t.string({ nullable: true, resolve: (admin) => lastName(admin.fullname) }),
    email: t.exposeString('email'),
    fullname: t.exposeString('fullname'),
    avatarURL: t.string({ nullable: true, resolve: (admin) => admin.avatar_url }),
    students: t.connection(
      {
        type: StudentRef,
        nullable: true,
        resolve: async (_admin, args) => resolveArrayConnection({ args }, await listStudents()),
      },
      StudentConnection
    ),
    pendingStudentPasswordRecoveryRequestCount: t.int({
      description: 'Requests waiting for an admin (shown next to the menu item).',
      resolve: () => countPendingStudentRequests(),
    }),
    studentPasswordRecoveryRequests: t.connection(
      {
        type: StudentPasswordRecoveryRequestRef,
        nullable: true,
        resolve: async (_admin, args) => resolveArrayConnection({ args }, await listStudentRequests()),
      },
      StudentPasswordRecoveryRequestConnection
    ),
    disciplines: t.field({
      type: [DisciplineCodeRef],
      description: 'Codes for the `discipline_id` column of the grades spreadsheet.',
      resolve: () => listDisciplines(),
    }),
    notifications: t.connection(
      {
        type: NotificationRef,
        nullable: true,
        resolve: async (_admin, args) => resolveArrayConnection({ args }, await listNotifications()),
      },
      NotificationConnection
    ),
  }),
});
