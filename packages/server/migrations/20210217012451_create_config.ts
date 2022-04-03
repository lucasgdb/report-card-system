import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasConfigTable = await knex.schema.hasTable('config');
  if (hasConfigTable) {
    return;
  }

  await knex.schema.createTable('config', (t) => {
    t.increments('id').unsigned().primary();

    t.string('name').notNullable();
    t.string('value');
    t.boolean('public').defaultTo(true);

    t.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('config');
};
