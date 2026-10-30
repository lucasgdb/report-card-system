import { __DEV__ } from '@usefaz/shared';
import dayjs from 'dayjs';
import { createHandler } from 'graphql-http';
import Koa from 'koa';
import type { Context, Next } from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import type { IncomingMessage } from 'node:http';

import schema from './modules/schema';
import auth from './middlewares/auth';
import generateSchema from './utils/generateSchema';
import type { IContext } from './interfaces';

if (__DEV__) {
  generateSchema();
}

const now = () => dayjs().format('HH:mm:ss DD/MM/YYYY');

const handleGraphQL = createHandler<IncomingMessage, Context, IContext>({
  schema,
  context: ({ context: ctx }) => ({
    user: ctx.request.user,
    admin: ctx.request.admin,
    student: ctx.request.student,
    loginId: ctx.request.loginId,
  }),
  formatError: (error) => {
    const path = 'path' in error ? (error.path?.join(' -> ') ?? '') : '';
    console.error(`ERROR[${now()}][${path}] ===> ${error.message}`);

    return error;
  },
  onOperation: ({ context: ctx }, { document }) => {
    const difference = Date.now() - ctx.request.startedAt!;

    for (const definition of document.definitions) {
      if ('name' in definition && definition.name) {
        console.info(`[${now()}] - ${definition.name.value} = ${difference}`);
      }
    }
  },
});

const graphQLServer = new Koa();

graphQLServer.use(
  cors({
    allowMethods: ['POST'],
    credentials: true,
  })
);

const addRequestStartedAt = (ctx: Context, next: Next) => {
  ctx.request.startedAt = Date.now();
  return next();
};

const router = new Router();

router.use(auth.studentAuthenticator(), auth.adminAuthenticator(), addRequestStartedAt);

router.post('/graphql', async (ctx) => {
  const [body, init] = await handleGraphQL({
    url: ctx.url,
    method: ctx.method,
    headers: ctx.headers,
    // `koa-body` (see server.ts) has already parsed the JSON body.
    body: () => ctx.request.body as Record<string, unknown>,
    raw: ctx.req,
    context: ctx,
  });

  ctx.body = body;
  ctx.status = init.status;

  for (const [name, value] of Object.entries(init.headers ?? {})) {
    ctx.set(name, value);
  }
});

graphQLServer.use(router.routes()).use(router.allowedMethods());

export default graphQLServer;
