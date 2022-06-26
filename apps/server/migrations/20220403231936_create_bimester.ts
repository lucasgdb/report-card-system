import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('bimester');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('bimester', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('school_report_discipline_id').unsigned().notNullable();
    table.foreign('school_report_discipline_id').references('school_report_discipline.id');

    table.enum('identifier', [1, 2, 3, 4]).notNullable();

    table.tinyint('grade').notNullable();

    table.tinyint('rec_grade').nullable();

    table.tinyint('absences').notNullable().defaultTo(0);

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('bimester');
};
