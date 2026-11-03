import { pino } from 'pino';

import env, { isDev } from '#/env.ts';

/** Structured logs (JSON in production, readable lines in development). */
const logger = pino({
  level: env.LOG_LEVEL,
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname', singleLine: true },
        },
      }
    : {}),
  redact: ['req.headers.cookie', 'req.headers.authorization', '*.password', '*.token'],
});

export default logger;
