import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  DEVELOPMENT: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: 'schema_version',
      stub: 'migration.stub',
    },
    seeds: {
      stub: 'seed.stub',
    },
  },

  HOMOLOG: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: 'schema_version',
    },
  },

  PRODUCTION: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: 'schema_version',
    },
  },
};

module.exports = config;
