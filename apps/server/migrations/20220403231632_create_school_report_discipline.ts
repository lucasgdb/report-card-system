import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('school_report_discipline');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('school_report_discipline', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('school_report_id').unsigned().notNullable();
    table.foreign('school_report_id').references('school_report.id');

    table.integer('discipline_id').unsigned().notNullable();
    table.foreign('discipline_id').references('discipline.id');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('school_report_discipline');
};
