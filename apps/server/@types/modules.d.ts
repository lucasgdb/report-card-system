import type { IAdmin, IStudent, IUser } from '~/interfaces';

declare module 'koa' {
  interface Request {
    user?: IUser;
    admin?: IAdmin;
    student?: IStudent;
    loginId?: string;
    startedAt?: number;
  }
}
