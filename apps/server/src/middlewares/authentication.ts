import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Context, Next } from 'koa';

import { UserModel, AuthModel } from '~/entities';
import usefazConnector from '~/database/usefazConnector';
import { errorConfig } from '@usefaz/shared';

type authenticateProps = {
  protectedRoutes: boolean;
};

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const getPayload = (ctx: Context): Promise<{ id: string }> | false => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', (err, payload) => {
      if (err) {
        reject(err);
      }

      resolve(payload);
    })(ctx.request, ctx.response);
  });
};

const authentication = () => {
  const strategy = new Strategy(params, (payload: { id: string }, done) => {
    const { id } = payload;

    return done(null, { id });
  });

  passport.use(strategy);

  return {
    initialize: (_ctx: Context, next: Next) => {
      passport.initialize();
      return next();
    },
    authenticate:
      ({ protectedRoutes }: authenticateProps = { protectedRoutes: false }) =>
      async (ctx: Context, next: Next) => {
        try {
          const payload = await getPayload(ctx);

          if (protectedRoutes && !payload) {
            throw new Error(errorConfig.user.unauthenticated.code);
          }

          if (!payload) {
            return next();
          }

          const authEntity = AuthModel(usefazConnector);

          const login = await authEntity.getLoginBy({ id: payload.id });

          if (protectedRoutes && !login?.active) {
            throw new Error(errorConfig.user.unauthenticated.code);
          }

          if (!login?.active) {
            return next();
          }

          const userEntity = UserModel(usefazConnector);
          const user = await userEntity.getUserById(login.user_id!);

          ctx.request.loginId = login.id;
          ctx.request.user = user;

          return next();
        } catch {
          ctx.status = 401;
          ctx.body = {
            message: errorConfig.user.unauthenticated.message,
          };
        }
      },
  };
};

export default authentication;
