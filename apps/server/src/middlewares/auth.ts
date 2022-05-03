import { errorConfig } from '@usefaz/shared';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Context, Next } from 'koa';

import { UserModel, AuthModel, AdminModel, StudentModel } from '~/entities';
import usefazConnector from '~/database/usefazConnector';

type authenticateProps = {
  requireAuth: boolean;
};

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const DEFAULT_PARAMS = {
  requireAuth: false,
};

type Payload = {
  id: string;
  RM: string | undefined;
  email: string | undefined;
};

const getPayload = (ctx: Context): Promise<Payload> | false => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, payload) => {
      if (err) {
        reject(err);
      }

      resolve(payload);
    })(ctx.request, ctx.response);
  });
};

const auth = () => {
  const strategy = new Strategy(params, (payload: Payload, done) => {
    const { id, RM, email } = payload;

    return done(null, { id, RM, email });
  });

  passport.use(strategy);

  return {
    initialize: (_ctx: Context, next: Next) => {
      passport.initialize();
      return next();
    },
    authenticate:
      ({ requireAuth = false }: authenticateProps = DEFAULT_PARAMS) =>
      async (ctx: Context, next: Next) => {
        try {
          const payload = await getPayload(ctx);

          if (requireAuth && !payload) {
            throw new Error(errorConfig.user.unauthenticated.code);
          } else if (!payload) {
            return next();
          }

          const authEntity = AuthModel(usefazConnector);

          const login = await authEntity.getLoginBy({ id: payload.id });

          if (requireAuth && !login?.active) {
            throw new Error(errorConfig.user.unauthenticated.code);
          } else if (!login?.active) {
            return next();
          }

          const userEntity = UserModel(usefazConnector);
          const user = await userEntity.getUserById(login.user_id!);

          if (payload.email) {
            const adminEntity = AdminModel(usefazConnector);
            const admin = await adminEntity.getAdminByEmail(payload.email);
            ctx.request.admin = admin;
          } else if (payload.RM) {
            const studentEntity = StudentModel(usefazConnector);
            const student = await studentEntity.getStudentByRM(payload.RM);
            ctx.request.student = student;
          }

          ctx.request.loginId = login.id;
          ctx.request.user = user;

          return next();
        } catch {
          ctx.status = 401;
          ctx.body = {
            message: errorConfig.user.unauthenticated.code,
          };
        }
      },
  };
};

export default auth;
