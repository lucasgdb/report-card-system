import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('article');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('article', (table) => {
    table.increments('id').unsigned().primary();

    table.string('title').notNullable();
    table.text('text').notNullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('article');
};
