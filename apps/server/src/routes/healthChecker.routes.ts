import Router from '@koa/router';

import { checkHealth } from '~/controllers/healthCheckerController';

const router = new Router();

router.get('/hc', checkHealth);

export default router;
