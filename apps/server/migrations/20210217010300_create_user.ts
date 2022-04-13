import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('user');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('user', (table) => {
    table.increments('id').unsigned().primary();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('user');
};
