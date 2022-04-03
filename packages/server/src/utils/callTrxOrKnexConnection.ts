import type { Knex } from 'knex';

import type { DBConnector } from '~/database/dbConnector';

const callTrxOrKnexConnection = <T>(tableName: string, dbConnector: DBConnector, trx?: Knex.Transaction) => {
  if (trx) {
    return trx<T>(tableName);
  }

  return dbConnector.knexConnection<T>(tableName);
};

export default callTrxOrKnexConnection;
