import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('student');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('student', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('user.id');

    table.string('RM').unique().notNullable();

    table.string('fullname').notNullable();

    table.string('password').notNullable();

    table.string('avatar_url').unique().nullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('student');
};
