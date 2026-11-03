import { serve } from '@hono/node-server';

import db from '#/database/db.ts';
import env from '#/env.ts';
import app from '#/http/app.ts';
import logger from '#/logger.ts';

const server = serve({ fetch: app.fetch, port: env.PORT }, () => {
  logger.info(`Server is now running on ${env.BASE_URL}`);
});

// Finishes in-flight requests and closes the database pool on shutdown.
const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(() => void db.destroy().finally(() => process.exit(0)));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
