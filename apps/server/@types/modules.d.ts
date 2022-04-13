import { IUser } from '~/interfaces';

declare module 'koa' {
  interface Request {
    user?: IUser;
    loginId?: string;
    startedAt?: number;
  }
}
