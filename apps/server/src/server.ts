import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';

import { healthCheckerGet } from './controllers/healthCheckerController';

const server = new Koa();
const router = new Router();

server.use(cors({ allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));

router.get('/hc', healthCheckerGet);

server.use(router.routes()).use(router.allowedMethods());

export default server;
