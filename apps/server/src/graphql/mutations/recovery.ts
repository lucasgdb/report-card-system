import { encodeGlobalID } from '@pothos/plugin-relay';
import { z } from 'zod';

import { hashPassword, verifyPassword } from '#/auth/password.ts';
import { limitAttempts } from '#/auth/rateLimit.ts';
import { endAllSessions } from '#/auth/session.ts';
import { createToken, hashToken } from '#/auth/tokens.ts';
import db from '#/database/db.ts';
import env from '#/env.ts';
import builder from '#/graphql/builder.ts';
import { parseInput, UserError, withUserErrors } from '#/graphql/errors.ts';
import {
  AdminPasswordRecoveryRequestRef,
  StudentPasswordRecoveryRequestRef,
} from '#/graphql/types/recoveryRequests.ts';
import { MutationErrorRef } from '#/graphql/types/shared.ts';
import { email, passwordWithConfirmation, RM } from '#/graphql/validation.ts';
import { sendAdminPasswordResetEmail } from '#/mail.ts';
import { findAdminByEmail, findAdminById, updateAdminPassword } from '#/repositories/admins.ts';
import { createNotification } from '#/repositories/notifications.ts';
import {
  completeStudentRequest,
  createAdminReset,
  findUsableAdminReset,
  findUsableStudentRequest,
  markAdminResetUsed,
} from '#/repositories/recoveryRequests.ts';
import { findStudentByRM, updateStudent } from '#/repositories/students.ts';

const INVALID_LINK = 'Este link é inválido ou expirou. Solicite um novo link de recuperação.';

// Students: ask for help → an admin approves → the student sets a new password from the e-mailed link.

const SendStudentRequestInput = z.object({
  RM,
  email: email('Informe seu e-mail.'),
});

builder.relayMutationField(
  'sendStudentPasswordRecoveryRequest',
  {
    name: 'SendStudentPasswordRecoveryRequestMutationInput',
    inputFields: (t) => ({ RM: t.string(), email: t.string() }),
  },
  {
    description: 'A student who forgot their password asks the admins for a reset link.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        const values = parseInput(SendStudentRequestInput, input);
        limitAttempts('recovery', { ip: ctx.ip });

        const student = await findStudentByRM(values.RM);
        if (!student) {
          throw new UserError('Não encontramos um aluno com esse número de matrícula.', 'RM');
        }

        await db.transaction().execute(async (trx) => {
          await trx
            .insertInto('student_password_recovery_request')
            .values({ rm: student.rm, email: values.email })
            .execute();
          await createNotification(trx, {
            title: 'Nova solicitação',
            message: `Nova solicitação de recuperação de senha de ${student.fullname}`,
          });
        });
        return {};
      }),
  },
  {
    name: 'SendStudentPasswordRecoveryRequestMutationPayload',
    outputFields: (t) => ({
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

const ResetStudentPasswordInput = passwordWithConfirmation.and(z.object({ passwordRecoveryToken: z.string() }));

builder.relayMutationField(
  'resetStudentPassword',
  {
    name: 'ResetStudentPasswordMutationInput',
    inputFields: (t) => ({
      studentPasswordRecoveryRequestId: t.globalID({ for: StudentPasswordRecoveryRequestRef }),
      passwordRecoveryToken: t.string(),
      password: t.string(),
      passwordConfirmation: t.string(),
    }),
  },
  {
    description: 'A student sets a new password with the link an admin sent them. Signs them out everywhere.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        limitAttempts('reset', { ip: ctx.ip });
        const values = parseInput(ResetStudentPasswordInput, input);

        const request = await findUsableStudentRequest(
          Number(input.studentPasswordRecoveryRequestId.id),
          hashToken(values.passwordRecoveryToken)
        );
        const student = request && (await findStudentByRM(request.rm));
        if (!request || !student) {
          throw new UserError(INVALID_LINK);
        }

        await updateStudent(student.id, { password_hash: await hashPassword(values.password) });
        await completeStudentRequest(request.id);
        await endAllSessions(student.user_id);
        return {};
      }),
  },
  {
    name: 'ResetStudentPasswordMutationPayload',
    outputFields: (t) => ({
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

// Admins: e-mail themselves a reset link and use it.

const SendAdminRecoveryEmailInput = z.object({ email: email('Informe o e-mail da sua conta.') });

builder.relayMutationField(
  'sendAdminRecoveryEmail',
  {
    name: 'SendAdminRecoveryEmailMutationInput',
    inputFields: (t) => ({ email: t.string() }),
  },
  {
    description: 'E-mails an admin a link to choose a new password.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        const values = parseInput(SendAdminRecoveryEmailInput, input);
        limitAttempts('recovery', { ip: ctx.ip });

        const admin = await findAdminByEmail(values.email);
        if (!admin) {
          throw new UserError('Não encontramos uma conta com esse e-mail.', 'email');
        }

        const token = createToken();
        const reset = await createAdminReset(admin.id, hashToken(token));
        const id = encodeGlobalID('AdminPasswordRecoveryRequest', reset.id);
        await sendAdminPasswordResetEmail(admin.email, `${env.ADMIN_WEB_URL}/#/recuperar-senha/${id}/${token}`);
        return {};
      }),
  },
  {
    name: 'SendAdminRecoveryEmailMutationPayload',
    outputFields: (t) => ({
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

const RecoverAdminPasswordInput = passwordWithConfirmation.and(z.object({ passwordRecoveryToken: z.string() }));

builder.relayMutationField(
  'recoverAdminPassword',
  {
    name: 'RecoverAdminPasswordMutationInput',
    inputFields: (t) => ({
      adminPasswordRecoveryRequestId: t.globalID({ for: AdminPasswordRecoveryRequestRef }),
      passwordRecoveryToken: t.string(),
      password: t.string(),
      passwordConfirmation: t.string(),
    }),
  },
  {
    description: 'An admin sets a new password with their reset link. Signs them out everywhere.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        limitAttempts('reset', { ip: ctx.ip });
        const values = parseInput(RecoverAdminPasswordInput, input);

        const reset = await findUsableAdminReset(
          Number(input.adminPasswordRecoveryRequestId.id),
          hashToken(values.passwordRecoveryToken)
        );
        const admin = reset && (await findAdminById(reset.admin_id));
        if (!reset || !admin) {
          throw new UserError(INVALID_LINK);
        }
        if (await verifyPassword(values.password, admin.password_hash)) {
          throw new UserError('A nova senha precisa ser diferente da atual.', 'password');
        }

        await updateAdminPassword(admin.id, await hashPassword(values.password));
        const used = await markAdminResetUsed(reset.id);
        await endAllSessions(admin.user_id);
        return { adminPasswordRecoveryRequest: used };
      }),
  },
  {
    name: 'RecoverAdminPasswordMutationPayload',
    outputFields: (t) => ({
      adminPasswordRecoveryRequest: t.field({
        type: AdminPasswordRecoveryRequestRef,
        nullable: true,
        resolve: (payload) => payload.adminPasswordRecoveryRequest ?? null,
      }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);
