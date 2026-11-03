import { getConnInfo } from '@hono/node-server/conninfo';
import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { type App, findSession, sessionCookieName } from '#/auth/session.ts';
import env from '#/env.ts';
import type { Viewer } from '#/graphql/context.ts';
import { findAdminByUserId } from '#/repositories/admins.ts';
import { findStudentByUserId } from '#/repositories/students.ts';

export type HonoEnv = { Variables: { viewer: Viewer; app: App; ip: string } };

/** The app the request comes from (`X-Usefaz-App`), which picks the session cookie to read. */
const appOf = (c: Context): App => (c.req.header('X-Usefaz-App') === 'admin' ? 'admin' : 'boletim');

const ipOf = (c: Context) =>
  (env.TRUST_PROXY ? c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() : undefined) ??
  getConnInfo(c).remote.address ??
  'unknown';

/** Resolves who is signed in (from the app's session cookie) for the routes after it. */
export const viewerMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const app = appOf(c);
  c.set('app', app);
  c.set('ip', ipOf(c));

  const token = getCookie(c, sessionCookieName(app));
  const session = token ? await findSession(token) : undefined;
  if (!session) {
    c.set('viewer', null);
    return next();
  }

  const [student, admin] = await Promise.all([
    app === 'boletim' ? findStudentByUserId(session.user_id) : undefined,
    app === 'admin' ? findAdminByUserId(session.user_id) : undefined,
  ]);
  c.set('viewer', { sessionId: session.id, userId: session.user_id, student: student ?? null, admin: admin ?? null });
  return next();
});
