import type { CookieOptions } from 'hono/utils/cookie';
import { serialize } from 'hono/utils/cookie';

import { createToken, hashToken } from '#/auth/tokens.ts';
import db from '#/database/db.ts';
import env from '#/env.ts';

/** The two web apps, each with its own session cookie (someone can be signed in to both). */
export type App = 'boletim' | 'admin';

const SESSION_HOURS: Record<App, number> = { boletim: 2, admin: 6 };

// Each user keeps at most this many sessions; the oldest ends when a new one starts.
const MAX_SESSIONS = 2;

export const sessionCookieName = (app: App) => `usefaz_${app}_session`;

const cookieOptions = (maxAge: number): CookieOptions => ({
  path: '/',
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE === 'none' ? 'None' : env.COOKIE_SAME_SITE === 'strict' ? 'Strict' : 'Lax',
  maxAge,
});

/** Starts a session for the user and returns the `Set-Cookie` value that carries it. */
export async function startSession(app: App, userId: number) {
  const token = createToken();
  const maxAge = SESSION_HOURS[app] * 60 * 60;

  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto('session')
      .values({ user_id: userId, token_hash: hashToken(token), expires_at: new Date(Date.now() + maxAge * 1000) })
      .execute();

    const kept = trx
      .selectFrom('session')
      .select('id')
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .limit(MAX_SESSIONS);
    await trx.deleteFrom('session').where('user_id', '=', userId).where('id', 'not in', kept).execute();
  });

  return serialize(sessionCookieName(app), token, cookieOptions(maxAge));
}

/** The unexpired session a cookie's token belongs to. */
export function findSession(token: string) {
  return db
    .selectFrom('session')
    .select(['id', 'user_id'])
    .where('token_hash', '=', hashToken(token))
    .where('expires_at', '>', new Date())
    .executeTakeFirst();
}

/** The `Set-Cookie` value that removes the app's session cookie. */
export const clearSessionCookie = (app: App) => serialize(sessionCookieName(app), '', cookieOptions(0));

/** Ends a session (sign-out). */
export async function endSession(sessionId: number) {
  await db.deleteFrom('session').where('id', '=', sessionId).execute();
}

/** Signs a user out everywhere (after a password change). */
export async function endAllSessions(userId: number) {
  await db.deleteFrom('session').where('user_id', '=', userId).execute();
}

// Expired sessions are cleaned up hourly.
setInterval(
  () =>
    void db
      .deleteFrom('session')
      .where('expires_at', '<=', new Date())
      .execute()
      .catch(() => undefined),
  60 * 60 * 1000
).unref();
