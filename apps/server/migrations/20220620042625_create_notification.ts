import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('notification');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('notification', (table) => {
    table.increments('id').unsigned().primary();

    table.string('title').notNullable();
    table.string('message').notNullable();

    table.boolean('viewed').defaultTo(false);

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('notification');
};
