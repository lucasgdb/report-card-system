import type { Context } from 'koa';

import exampleConnector from '~/database/exampleConnector';

export const healthCheckerGet = async (ctx: Context) => {
  const hasConnection = await exampleConnector.checkConnection();
  if (hasConnection) {
    ctx.status = 200;
    ctx.body = 'OK';

    return;
  }

  ctx.status = 503;
  ctx.body = 'DB out of service!';
};
