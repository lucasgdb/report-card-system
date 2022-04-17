import Koa from 'koa';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';

import healthCheckerRouter from './routes/healthChecker.routes';
import uploadPhotoRouter from './routes/uploadPhoto.routes';

import mount from 'koa-mount';
import path from 'path';

const server = new Koa();

server.use(koaBody());

server.use(mount('/public', koaStatic(path.resolve(__dirname, '../public'))));

server.use(healthCheckerRouter.routes()).use(healthCheckerRouter.allowedMethods());
server.use(uploadPhotoRouter.routes()).use(uploadPhotoRouter.allowedMethods());

export default server;
