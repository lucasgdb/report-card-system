import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('bimester');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('bimester', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('bimester_identifier_id').unsigned().notNullable();
    table.foreign('bimester_identifier_id').references('bimester_identifier.id');

    table.tinyint('grade').notNullable();

    table.tinyint('rec_grade').nullable();

    table.tinyint('absences').nullable();

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('bimester');
};
