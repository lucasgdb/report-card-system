import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('boletim');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('boletim', (table) => {
    table.increments('id').unsigned().primary();

    table.tinyint('year').notNullable();

    table.integer('student_id').unsigned();
    table.foreign('student_id').references('student.id');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('boletim');
};
