import type { App } from '#/auth/session.ts';
import type { AdminRow } from '#/repositories/admins.ts';
import type { StudentRow } from '#/repositories/students.ts';

/** Who is making the request: nobody, a student (boletim) or an admin. */
export type Viewer = {
  sessionId: number;
  userId: number;
  student: StudentRow | null;
  admin: AdminRow | null;
} | null;

export type GraphQLContext = {
  viewer: Viewer;
  /** The web app the request comes from (its session cookie is the one that counts). */
  app: App;
  ip: string;
  /** `Set-Cookie` values added to the response (sessions start and end in mutations). */
  setCookies: string[];
};
