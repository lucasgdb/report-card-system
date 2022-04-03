import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'dayjs/locale/pt-br';

import { printSchema } from 'graphql/utilities';
import fs from 'fs';
import path from 'path';
import localeData from 'dayjs/plugin/localeData';
import dayjs from 'dayjs';
import Koa from 'koa';
import mount from 'koa-mount';
import cors from '@koa/cors';
import type { Options } from '@koa/cors';
import koaBody from 'koa-body';
import koaCompress from 'koa-compress';

dayjs.locale('pt-br');
dayjs.extend(localeData);

import server from './server';
import graphQLServer from './graphQLServer';
import schema from './modules/schema';

const { BASE_URL, PORT } = process.env;

const app = new Koa();

const corsConfig: Options = {
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(koaCompress());
app.use(koaBody());

app.use(mount('/api', server));
app.use(mount('/graphql', graphQLServer));

app.listen(PORT, () => {
  console.info(`Server is now running on ${BASE_URL}`);

  const graphQLFile = path.resolve(__dirname, '../schema.graphql');
  const schemaString = printSchema(schema);

  fs.writeFileSync(graphQLFile, schemaString);
});
