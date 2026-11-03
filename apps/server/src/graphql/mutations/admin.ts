import { encodeGlobalID, resolveArrayConnection } from '@pothos/plugin-relay';
import { z } from 'zod';

import { hashPassword } from '#/auth/password.ts';
import { endAllSessions } from '#/auth/session.ts';
import { createToken, hashToken } from '#/auth/tokens.ts';
import db from '#/database/db.ts';
import env from '#/env.ts';
import builder, { requireAdmin } from '#/graphql/builder.ts';
import { parseInput, UserError, withUserErrors } from '#/graphql/errors.ts';
import { NotificationConnection, NotificationRef } from '#/graphql/types/notification.ts';
import { AdminRef } from '#/graphql/types/admin.ts';
import { StudentPasswordRecoveryRequestRef } from '#/graphql/types/recoveryRequests.ts';
import { firstName, MutationErrorRef } from '#/graphql/types/shared.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import { newPassword, RM, requiredText } from '#/graphql/validation.ts';
import { sendStudentPasswordResetEmail } from '#/mail.ts';
import { findNotificationsByIds, markNotificationsAsViewed } from '#/repositories/notifications.ts';
import {
  findStudentRequestById,
  refuseStudentRequest,
  setStudentRequestLink,
} from '#/repositories/recoveryRequests.ts';
import { listDisciplines, saveReportCardLine } from '#/repositories/schoolReports.ts';
import { deleteStudent, findStudentByRM, findStudentsByIds, updateStudent } from '#/repositories/students.ts';
import { removeQuietly } from '#/storage.ts';

const ChangeStudentInformationInput = z.object({
  RM,
  fullname: requiredText('Informe o nome completo.').max(255, 'O nome é longo demais.'),
  // Optional: left blank, the password stays the same.
  password: z.union([z.literal(''), newPassword]).optional(),
});

builder.relayMutationField(
  'changeStudentInformation',
  {
    name: 'ChangeStudentInformationMutationInput',
    inputFields: (t) => ({
      studentId: t.globalID({ for: StudentRef }),
      RM: t.string(),
      fullname: t.string(),
      password: t.string({ required: false }),
    }),
  },
  {
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);
        const values = parseInput(ChangeStudentInformationInput, input);

        const [student] = await findStudentsByIds([Number(input.studentId.id)]);
        if (!student) {
          throw new UserError('Este aluno não existe mais. Atualize a página.');
        }
        const withSameRM = await findStudentByRM(values.RM);
        if (withSameRM && withSameRM.id !== student.id) {
          throw new UserError('Já existe um aluno com esse número de matrícula.', 'RM');
        }

        const updated = await updateStudent(student.id, {
          rm: values.RM,
          fullname: values.fullname,
          ...(values.password ? { password_hash: await hashPassword(values.password) } : {}),
        });
        if (values.password) {
          await endAllSessions(student.user_id);
        }
        return { student: updated };
      }),
  },
  {
    name: 'ChangeStudentInformationMutationPayload',
    outputFields: (t) => ({
      student: t.field({ type: StudentRef, nullable: true, resolve: (payload) => payload.student ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

builder.relayMutationField(
  'sendStudentPasswordResetLink',
  {
    name: 'SendStudentPasswordResetLinkMutationInput',
    inputFields: (t) => ({
      studentPasswordRecoveryRequestId: t.globalID({ for: StudentPasswordRecoveryRequestRef }),
    }),
  },
  {
    description: "Approves a student's request: e-mails them a link to choose a new password (again, if resent).",
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);

        const request = await findStudentRequestById(Number(input.studentPasswordRecoveryRequestId.id));
        if (!request || (request.status !== 'PENDING' && request.status !== 'LINK_SENT')) {
          throw new UserError('Esta solicitação já foi concluída. Atualize a página.');
        }
        const student = await findStudentByRM(request.rm);
        if (!student) {
          throw new UserError('Não encontramos o aluno desta solicitação. Ele pode ter sido removido.');
        }

        const token = createToken();
        const updated = await setStudentRequestLink(request.id, hashToken(token));
        const id = encodeGlobalID('StudentPasswordRecoveryRequest', request.id);
        await sendStudentPasswordResetEmail(request.email, {
          firstname: firstName(student.fullname),
          url: `${env.BOLETIM_WEB_URL}/#/redefinir-senha/${id}/${token}`,
        });
        return { studentPasswordRecoveryRequest: updated };
      }),
  },
  {
    name: 'SendStudentPasswordResetLinkMutationPayload',
    outputFields: (t) => ({
      studentPasswordRecoveryRequest: t.field({
        type: StudentPasswordRecoveryRequestRef,
        nullable: true,
        resolve: (payload) => payload.studentPasswordRecoveryRequest ?? null,
      }),
      // The admin again, so the pending count in the menu updates.
      admin: t.field({ type: AdminRef, nullable: true, resolve: (_payload, _args, ctx) => ctx.viewer?.admin ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

builder.relayMutationField(
  'refuseStudentPasswordRecoveryRequest',
  {
    name: 'RefuseStudentPasswordRecoveryRequestMutationInput',
    inputFields: (t) => ({
      studentPasswordRecoveryRequestId: t.globalID({ for: StudentPasswordRecoveryRequestRef }),
    }),
  },
  {
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);
        const request = await findStudentRequestById(Number(input.studentPasswordRecoveryRequestId.id));
        if (!request) {
          throw new UserError('Esta solicitação não existe mais. Atualize a página.');
        }
        return { studentPasswordRecoveryRequest: await refuseStudentRequest(request.id) };
      }),
  },
  {
    name: 'RefuseStudentPasswordRecoveryRequestMutationPayload',
    outputFields: (t) => ({
      studentPasswordRecoveryRequest: t.field({
        type: StudentPasswordRecoveryRequestRef,
        nullable: true,
        resolve: (payload) => payload.studentPasswordRecoveryRequest ?? null,
      }),
      // The admin again, so the pending count in the menu updates.
      admin: t.field({ type: AdminRef, nullable: true, resolve: (_payload, _args, ctx) => ctx.viewer?.admin ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

builder.relayMutationField(
  'removeStudent',
  {
    name: 'RemoveStudentMutationInput',
    inputFields: (t) => ({ studentId: t.globalID({ for: StudentRef }) }),
  },
  {
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);
        const student = await deleteStudent(Number(input.studentId.id));
        if (!student) {
          throw new UserError('Este aluno já foi removido. Atualize a página.');
        }
        await removeQuietly(student.avatar_url);
        return { student };
      }),
  },
  {
    name: 'RemoveStudentMutationPayload',
    outputFields: (t) => ({
      student: t.field({ type: StudentRef, nullable: true, resolve: (payload) => payload.student ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

builder.relayMutationField(
  'setNotificationsAsViewed',
  {
    name: 'SetNotificationsAsViewedMutationInput',
    inputFields: (t) => ({ notificationIds: t.globalIDList({ for: NotificationRef }) }),
  },
  {
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);
        const ids = input.notificationIds.map(({ id }) => Number(id));
        await markNotificationsAsViewed(ids);
        return { notifications: resolveArrayConnection({ args: {} }, await findNotificationsByIds(ids)) };
      }),
  },
  {
    name: 'SetNotificationsAsViewedMutationPayload',
    outputFields: (t) => ({
      notifications: t.field({
        type: NotificationConnection,
        nullable: true,
        resolve: (payload) => payload.notifications ?? null,
      }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

const BimesterMarksInput = builder.inputType('BimesterMarksInput', {
  description: "A bimester's marks; null while not given yet.",
  fields: (t) => ({
    grade: t.float({ required: false }),
    recGrade: t.float({ required: false }),
    absences: t.int({ required: false }),
  }),
});

const DisciplineMarksInput = builder.inputType('DisciplineMarksInput', {
  fields: (t) => ({
    disciplineCode: t.int(),
    /** The four bimesters, in order. */
    bimesters: t.field({ type: [BimesterMarksInput] }),
  }),
});

const mark = (max: number, message: string) => z.number().min(0, message).max(max, message).nullish();
const SaveStudentGradesInput = z.object({
  year: z.number().int().min(2000, 'Informe um ano válido.').max(2100, 'Informe um ano válido.'),
  disciplines: z.array(
    z.object({
      disciplineCode: z.number().int().positive(),
      bimesters: z
        .array(
          z.object({
            grade: mark(10, 'As notas vão de 0 a 10.'),
            recGrade: mark(10, 'As notas vão de 0 a 10.'),
            absences: z
              .number()
              .int('Faltas são um número inteiro.')
              .min(0, 'Faltas não podem ser negativas.')
              .nullish(),
          })
        )
        .length(4),
    })
  ),
});

builder.relayMutationField(
  'saveStudentGrades',
  {
    name: 'SaveStudentGradesMutationInput',
    inputFields: (t) => ({
      studentId: t.globalID({ for: StudentRef }),
      year: t.int(),
      disciplines: t.field({ type: [DisciplineMarksInput] }),
    }),
  },
  {
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        requireAdmin(ctx);
        const values = parseInput(SaveStudentGradesInput, input);

        const [student] = await findStudentsByIds([Number(input.studentId.id)]);
        if (!student) {
          throw new UserError('Este aluno não existe mais. Atualize a página.');
        }
        const codes = new Set((await listDisciplines()).map(({ id }) => id));
        if (values.disciplines.some(({ disciplineCode }) => !codes.has(disciplineCode))) {
          throw new UserError('Uma das disciplinas não existe mais. Atualize a página.');
        }

        await db.transaction().execute(async (trx) => {
          for (const discipline of values.disciplines) {
            await saveReportCardLine(trx, {
              studentId: student.id,
              year: values.year,
              disciplineId: discipline.disciplineCode,
              bimesters: discipline.bimesters.map((bimester) => ({
                grade: bimester.grade ?? null,
                recGrade: bimester.recGrade ?? null,
                absences: bimester.absences ?? null,
              })),
            });
          }
        });
        return { student };
      }),
  },
  {
    name: 'SaveStudentGradesMutationPayload',
    outputFields: (t) => ({
      student: t.field({ type: StudentRef, nullable: true, resolve: (payload) => payload.student ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);
