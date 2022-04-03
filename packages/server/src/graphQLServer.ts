import dayjs from 'dayjs';
import type { DefinitionNode } from 'graphql';
import Koa from 'koa';
import type { Context, Next } from 'koa';
import Router from '@koa/router';
import { graphqlHTTP } from 'koa-graphql';

import schema from './modules/schema';
import auth from './utils/auth';

const { NODE_ENV } = process.env;
const __DEV__ = NODE_ENV?.toUpperCase() === 'DEVELOPMENT';

type Definition = {
  name: { value: string } | undefined;
} & DefinitionNode;

const graphQLServer = new Koa();

const addRequestStartedAt = (ctx: Context, next: Next) => {
  ctx.request.startedAt = Date.now();
  return next();
};

const jwtAuthentication = auth();

const router = new Router();

router.use(jwtAuthentication.initialize, jwtAuthentication.authenticate, addRequestStartedAt);

router.post(
  '/',
  graphqlHTTP((request) => ({
    schema,
    graphiql: __DEV__,
    pretty: __DEV__,
    context: {
      user: request.user,
      loginId: request.loginId,
    },
    customFormatErrorFn: (error) => {
      console.error(
        `ERROR[${dayjs().format('HH:mm:ss DD/MM/YYYY')}][${error.path?.join(' -> ') ?? ''}] ===> ${error.message}`
      );

      return error;
    },
    extensions: ({ document }) => {
      document.definitions.forEach((definition) => {
        const { name } = <Definition>definition;
        if (!name) {
          return;
        }

        const now = dayjs().format('HH:mm:ss DD/MM/YYYY');
        const difference = Date.now() - request.startedAt!;

        console.info(`[${now}] - ${name.value} = ${difference}`);
      });

      return {};
    },
  }))
);

graphQLServer.use(router.routes()).use(router.allowedMethods());

export default graphQLServer;
