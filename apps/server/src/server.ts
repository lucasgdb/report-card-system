import Koa from 'koa';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';
import mount from 'koa-mount';
import path from 'path';
import cors from '@koa/cors';

import healthCheckerRouter from './routes/healthChecker.routes';
import avatarRouter from './routes/avatar.routes';
import adminRouter from './routes/admin.routes';

const server = new Koa();

server.use(cors({ allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));

server.use(mount('/public', koaStatic(path.resolve(__dirname, '../public'))));

server.use(avatarRouter.routes()).use(avatarRouter.allowedMethods());

server.use(koaBody({ multipart: true }));

server.use(healthCheckerRouter.routes()).use(healthCheckerRouter.allowedMethods());
server.use(adminRouter.routes()).use(adminRouter.allowedMethods());

export default server;
