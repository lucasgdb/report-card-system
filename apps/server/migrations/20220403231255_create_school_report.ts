import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('school_report');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('school_report', (table) => {
    table.increments('id').unsigned().primary();

    table.tinyint('year').notNullable();

    table.integer('student_id').unsigned().notNullable();
    table.foreign('student_id').references('student.id').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('school_report');
};
