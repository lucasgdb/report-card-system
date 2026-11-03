import path from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

import { checkConnection } from '#/database/db.ts';
import env from '#/env.ts';
import yoga from '#/graphql/yoga.ts';
import uploads from '#/http/uploads.ts';
import { type HonoEnv, viewerMiddleware } from '#/http/viewer.ts';
import logger from '#/logger.ts';
import { PUBLIC_DIR } from '#/paths.ts';

const app = new Hono<HonoEnv>();

app.use(async (c, next) => {
  const startedAt = performance.now();
  await next();
  if (c.req.path === '/hc') {
    return;
  }
  logger.info(
    { method: c.req.method, path: c.req.path, status: c.res.status, ms: Math.round(performance.now() - startedAt) },
    'request'
  );
});

app.use(
  cors({
    // Only the two web apps, with their cookies.
    origin: [env.BOLETIM_WEB_URL, env.ADMIN_WEB_URL],
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-Usefaz-App'],
    maxAge: 600,
  })
);

// The apps load avatars from this API (another origin), so resources are shareable cross-origin.
app.use(secureHeaders({ crossOriginResourcePolicy: 'cross-origin', crossOriginEmbedderPolicy: false }));
app.use(compress());

app.get('/hc', async (c) => ((await checkConnection()) ? c.text('OK') : c.text('Database unavailable', 503)));

// Uploaded files: never sniffed as anything but what they were saved as, never run as a page.
app.use('/public/*', async (c, next) => {
  await next();
  c.header('Content-Security-Policy', "default-src 'none'");
  c.header('Cache-Control', 'public, max-age=31536000, immutable');
});
app.use(
  '/public/*',
  serveStatic({ root: path.relative(process.cwd(), PUBLIC_DIR), rewriteRequestPath: (p) => p.replace(/^\/public/, '') })
);

app.use('/graphql', viewerMiddleware, bodyLimit({ maxSize: 100 * 1024 }));
app.on(['GET', 'POST'], '/graphql', async (c) => {
  const setCookies: string[] = [];
  const response = await yoga.fetch(c.req.raw, {
    viewer: c.get('viewer'),
    app: c.get('app'),
    ip: c.get('ip'),
    setCookies,
  });
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }
  return response;
});

app.use('/avatar/*', viewerMiddleware);
app.use('/admin/*', viewerMiddleware);
app.route('/', uploads);

app.onError((error, c) => {
  logger.error({ err: error, path: c.req.path }, 'unhandled error');
  return c.json({ message: 'Não foi possível concluir agora. Tente novamente em instantes.' }, 500);
});

export default app;
