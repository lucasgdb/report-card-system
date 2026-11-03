import { z } from 'zod';

import { hashPassword, needsRehash, verifyAgainstNothing, verifyPassword } from '#/auth/password.ts';
import { limitAttempts } from '#/auth/rateLimit.ts';
import { validateRecaptchaToken } from '#/auth/recaptcha.ts';
import { clearSessionCookie, endSession, startSession } from '#/auth/session.ts';
import builder from '#/graphql/builder.ts';
import { parseInput, UserError, withUserErrors } from '#/graphql/errors.ts';
import { AdminRef } from '#/graphql/types/admin.ts';
import { MutationErrorRef } from '#/graphql/types/shared.ts';
import { StudentRef } from '#/graphql/types/student.ts';
import { requiredText } from '#/graphql/validation.ts';
import { findAdminByEmail, updateAdminPassword } from '#/repositories/admins.ts';
import { findStudentByRM, updateStudent } from '#/repositories/students.ts';

const StudentLoginInput = z.object({
  RM: requiredText('Informe seu número de matrícula.'),
  password: z.string().min(1, 'Informe sua senha.'),
  token: z.string(),
});

builder.relayMutationField(
  'studentLogin',
  {
    name: 'StudentLoginMutationInput',
    inputFields: (t) => ({ RM: t.string(), password: t.string(), token: t.string() }),
  },
  {
    description: 'Signs a student in to the boletim: the session goes in an httpOnly cookie.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        const { RM, password, token } = parseInput(StudentLoginInput, input);
        limitAttempts('login', { ip: ctx.ip, account: `student:${RM}` });
        await validateRecaptchaToken(token);

        // Same message (and timing) for an unknown RM and a wrong password.
        const student = await findStudentByRM(RM);
        const valid = student
          ? await verifyPassword(password, student.password_hash)
          : await verifyAgainstNothing(password);
        if (!student || !valid) {
          throw new UserError('RM ou senha incorretos. Confira os dados e tente novamente.');
        }
        if (needsRehash(student.password_hash)) {
          await updateStudent(student.id, { password_hash: await hashPassword(password) });
        }

        ctx.setCookies.push(await startSession('boletim', student.user_id));
        return { student };
      }),
  },
  {
    name: 'StudentLoginMutationPayload',
    outputFields: (t) => ({
      student: t.field({ type: StudentRef, nullable: true, resolve: (payload) => payload.student ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

const AdminLoginInput = z.object({
  email: requiredText('Informe seu e-mail.'),
  password: z.string().min(1, 'Informe sua senha.'),
  token: z.string(),
});

builder.relayMutationField(
  'adminLogin',
  {
    name: 'AdminLoginMutationInput',
    inputFields: (t) => ({ email: t.string(), password: t.string(), token: t.string() }),
  },
  {
    description: 'Signs an admin in: the session goes in an httpOnly cookie.',
    resolve: (_root, { input }, ctx) =>
      withUserErrors(async () => {
        const { email, password, token } = parseInput(AdminLoginInput, input);
        limitAttempts('login', { ip: ctx.ip, account: `admin:${email}` });
        await validateRecaptchaToken(token);

        // Same message (and timing) for an unknown e-mail and a wrong password.
        const admin = await findAdminByEmail(email);
        const valid = admin
          ? await verifyPassword(password, admin.password_hash)
          : await verifyAgainstNothing(password);
        if (!admin || !valid) {
          throw new UserError('E-mail ou senha incorretos. Confira os dados e tente novamente.');
        }
        if (needsRehash(admin.password_hash)) {
          await updateAdminPassword(admin.id, await hashPassword(password));
        }

        ctx.setCookies.push(await startSession('admin', admin.user_id));
        return { admin };
      }),
  },
  {
    name: 'AdminLoginMutationPayload',
    outputFields: (t) => ({
      admin: t.field({ type: AdminRef, nullable: true, resolve: (payload) => payload.admin ?? null }),
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);

builder.relayMutationField(
  'logout',
  { name: 'LogoutMutationInput', inputFields: () => ({}) },
  {
    description: 'Ends the session of the app the request comes from and clears its cookie.',
    resolve: (_root, _args, ctx) =>
      withUserErrors(async () => {
        if (ctx.viewer) {
          await endSession(ctx.viewer.sessionId);
        }
        ctx.setCookies.push(clearSessionCookie(ctx.app));
        return {};
      }),
  },
  {
    name: 'LogoutMutationPayload',
    outputFields: (t) => ({
      error: t.field({ type: MutationErrorRef, nullable: true, resolve: (payload) => payload.error ?? null }),
    }),
  }
);
