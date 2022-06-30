import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'dayjs/locale/pt-br';

import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import Koa from 'koa';
import mount from 'koa-mount';
import koaCompress from 'koa-compress';

dayjs.locale('pt-br');
dayjs.extend(localeData);
dayjs.extend(relativeTime);

import server from './server';
import graphQLServer from './graphQLServer';

const { BASE_URL, PORT } = process.env;

const app = new Koa();

app.use(koaCompress());

app.use(mount('/', server));
app.use(mount('/', graphQLServer));

app.listen(PORT).on('listening', () => console.info(`Server is now running on ${BASE_URL}`));
