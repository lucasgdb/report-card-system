import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('admin');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('admin', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('user.id');

    table.string('email').unique().notNullable();

    table.string('password').notNullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('admin');
};
