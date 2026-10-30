import { errorConfig } from '@usefaz/shared';
import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';

import { UserModel, AuthModel, AdminModel, StudentModel } from '~/entities';
import usefazConnector from '~/database/usefazConnector';

type AuthenticateOptions = {
  requireAuth: boolean;
};

const DEFAULT_OPTIONS: AuthenticateOptions = {
  requireAuth: false,
};

type Payload = {
  id: string;
  RM: string | undefined;
  email: string | undefined;
};

// Reads the `Authorization: Bearer <token>` header. A missing, malformed, expired or badly signed
// token means the request is anonymous.
const getPayload = (ctx: Context): Payload | null => {
  const [scheme, token] = ctx.get('Authorization').split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  try {
    const { id, RM, email } = jwt.verify(token, process.env.JWT_SECRET) as Payload;
    return { id, RM, email };
  } catch {
    return null;
  }
};

const unauthenticated = (ctx: Context) => {
  ctx.status = 401;
  ctx.body = {
    message: errorConfig.user.unauthenticated.code,
  };
};

const authenticateLogin = async (ctx: Context, requireAuth: boolean) => {
  const payload = getPayload(ctx);
  if (!payload) {
    if (requireAuth) {
      throw new Error(errorConfig.user.unauthenticated.code);
    }

    return null;
  }

  const authEntity = AuthModel(usefazConnector);

  const login = await authEntity.getLoginBy({ id: payload.id });
  if (!login?.active) {
    if (requireAuth) {
      throw new Error(errorConfig.user.unauthenticated.code);
    }

    return null;
  }

  const userEntity = UserModel(usefazConnector);
  const user = await userEntity.getUserById(login.user_id!);

  ctx.request.loginId = login.id;
  ctx.request.user = user ?? null;

  return payload;
};

const auth = {
  studentAuthenticator({ requireAuth }: AuthenticateOptions = DEFAULT_OPTIONS) {
    return async (ctx: Context, next: Next) => {
      try {
        const payload = await authenticateLogin(ctx, requireAuth);
        if (!payload) {
          return next();
        }

        ctx.request.student = null;

        if (payload.RM) {
          const studentEntity = StudentModel(usefazConnector);
          ctx.request.student = await studentEntity.getStudentByRM(payload.RM);
        }
      } catch {
        unauthenticated(ctx);
        return;
      }

      return next();
    };
  },

  adminAuthenticator({ requireAuth }: AuthenticateOptions = DEFAULT_OPTIONS) {
    return async (ctx: Context, next: Next) => {
      try {
        const payload = await authenticateLogin(ctx, requireAuth);
        if (!payload) {
          return next();
        }

        ctx.request.admin = null;

        if (payload.email) {
          const adminEntity = AdminModel(usefazConnector);
          ctx.request.admin = await adminEntity.getAdminByEmail(payload.email);
        }
      } catch {
        unauthenticated(ctx);
        return;
      }

      return next();
    };
  },
};

export default auth;
