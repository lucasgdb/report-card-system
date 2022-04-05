import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('config');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('config', (table) => {
    table.increments('id').unsigned().primary();

    table.string('name').notNullable();

    table.string('value').nullable();

    table.boolean('public').defaultTo(true);

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('config');
};
