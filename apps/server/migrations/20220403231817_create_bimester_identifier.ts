import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('bimester_identifier');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('bimester_identifier', (table) => {
    table.increments('id').unsigned().primary();

    table.enum('identifier', [1, 2, 3, 4]).notNullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('bimester_identifier');
};
