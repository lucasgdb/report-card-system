import Koa from 'koa';
import Router from '@koa/router';

import { healthCheckerGet } from './controllers/healthCheckerController';

const server = new Koa();
const router = new Router();

router.get('/hc', healthCheckerGet);

server.use(router.routes()).use(router.allowedMethods());

export default server;
