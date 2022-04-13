import { knex } from 'knex';
import type { Knex } from 'knex';

export type DBConnector = {
  knexConnection: Knex<any, unknown[]>;
  checkConnection: () => Promise<boolean>;
  disconnect: (callback: () => void) => void;
};

const createKnexConnection = (connectionConfig: Knex.ConnectionConfig) => {
  const knexConnection = knex({
    client: 'postgresql',
    connection: connectionConfig,
    pool: { min: 0, max: 50 },
    postProcessResponse: (result) => {
      return result?.rows ?? result;
    },
  });

  return knexConnection;
};

export { createKnexConnection };
