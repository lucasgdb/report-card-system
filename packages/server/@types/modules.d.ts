import IUser from '~/models/IUser';

declare module 'koa' {
  interface Request {
    user?: IUser;
    loginId?: string;
    startedAt?: number;
  }
}
