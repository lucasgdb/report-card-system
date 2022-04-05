import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('boletim_discipline_bimester');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('boletim_discipline_bimester', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('boletim_discipline_id').unsigned();
    table.foreign('boletim_discipline_id').references('boletim_discipline.id');

    table.integer('bimester_id').unsigned();
    table.foreign('bimester_id').references('bimester.id');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('boletim_discipline_bimester');
};
