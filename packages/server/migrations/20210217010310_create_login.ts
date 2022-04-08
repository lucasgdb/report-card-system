import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('login');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('login', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('user_id').unsigned();
    table.foreign('user_id').references('user.id');

    table.boolean('active').notNullable().defaultTo(true);

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('login');
};
