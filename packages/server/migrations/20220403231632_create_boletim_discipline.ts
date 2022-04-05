import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('boletim_discipline');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('boletim_discipline', (table) => {
    table.increments('id').unsigned().primary();

    table.integer('boletim_id').unsigned();
    table.foreign('boletim_id').references('boletim.id');

    table.integer('discipline_id').unsigned();
    table.foreign('discipline_id').references('discipline.id');

    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('boletim_discipline');
};
