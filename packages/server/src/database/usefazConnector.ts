import assert from 'assert';
import type { Knex } from 'knex';

import type { DBConnector } from './dbConnector';
import { createKnexConnection } from './dbConnector';

const connectionConfig: Knex.ConnectionConfig = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
};

const knexConnection = createKnexConnection(connectionConfig);

const checkConnection = async () => {
  try {
    const [data] = await knexConnection.raw<[{ check: number }]>('SELECT 1+1 AS check');

    assert.strictEqual(data.check, 2);

    return true;
  } catch (e) {
    console.error('DB out of service!');
    return false;
  }
};

const disconnect = knexConnection.destroy;

const usefazConnector: DBConnector = {
  knexConnection,
  checkConnection,
  disconnect,
};

export default usefazConnector;
