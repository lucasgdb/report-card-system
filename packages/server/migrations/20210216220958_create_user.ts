import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasUserTable = await knex.schema.hasTable('user');
  if (hasUserTable) {
    return;
  }

  await knex.schema.createTable('user', (table) => {
    table.increments('id').unsigned().primary();

    table.string('email').notNullable().unique();

    table.string('password').notNullable();

    table.string('name').notNullable();
    table.string('lastname');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('user');
};
