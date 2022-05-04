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

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'DEVELOPMENT' | 'TEST' | 'PRODUCTION';
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      BASE_URL: string;
      ADMIN_WEB_URL: string;
      PORT: string;
      JWT_SECRET: string;
      RECAPTCHA_V3_SECRET_TOKEN: string;
      USEFAZ_EMAIL: string;
      USEFAZ_EMAIL_PASSWORD: string;
    }
  }
}
