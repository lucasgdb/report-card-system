import { errorConfig } from '@usefaz/shared';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Context, Next } from 'koa';

import UserModel from '~/entities/User/UserModel';
import AuthModel from '~/entities/Auth/AuthModel';
import usefazConnector from '~/database/usefazConnector';
import type IContext from '~/interfaces/IContext';

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const getUserOrThrowError = (context: IContext) => {
  if (!context.user?.id) {
    throw new Error(errorConfig.user.unauthenticated.code);
  }

  return context.user;
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

const auth = () => {
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
    authenticate: async (ctx: Context, next: Next) => {
      const payload = await getPayload(ctx);
      if (!payload) {
        return next();
      }

      const authEntity = AuthModel(usefazConnector);

      const login = await authEntity.getLoginById(payload.id);
      if (!login?.active) {
        return next();
      }

      const userEntity = UserModel(usefazConnector);
      const user = await userEntity.getUserById(login.user_id!);

      ctx.request.loginId = login.id;
      ctx.request.user = user;

      return next();
    },
  };
};

export default auth;
